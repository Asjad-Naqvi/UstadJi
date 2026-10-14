import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SlotLockService } from "../redis/slot-lock.service";
import { NotificationService } from "../notifications/notification.service";
import { QueueService } from "../queue/queue.service";
import {
  CreateBookingDto,
  RescheduleBookingDto,
  UpdateBookingStatusDto,
} from "./dto/booking.dto";

export interface TimeSlot {
  startTime: string; // "09:00"
  endTime: string;   // "10:00"
  isAvailable: boolean;
  isLocked: boolean;
  reason?: string;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slotLockService: SlotLockService,
    private readonly notificationService: NotificationService,
    private readonly queueService: QueueService
  ) {}

  /**
   * Synchronizes provider availability in real time based on configured
   * working hours, existing bookings, required buffer gaps, and temporary locks.
   */
  async getAvailableSlots(providerId: string, dateStr: string): Promise<TimeSlot[]> {
    const targetDate = new Date(dateStr);
    const dayOfWeek = targetDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    // 1. Fetch provider profile & working hours
    const providerUser = await this.prisma.user.findUnique({
      where: { id: providerId },
      include: {
        providerProfile: {
          include: { workingHours: true },
        },
      },
    });

    if (!providerUser || !providerUser.providerProfile) {
      throw new NotFoundException("Provider profile not found");
    }

    const profile = providerUser.providerProfile;
    const workingDay = profile.workingHours.find((wh) => wh.dayOfWeek === dayOfWeek);

    if (!workingDay || !workingDay.isWorkingDay) {
      return []; // Provider does not work on this day
    }

    // 2. Fetch existing bookings on target date
    const startOfDay = new Date(dateStr);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(dateStr);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        providerId,
        appointmentDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: {
          in: ["PENDING_ACCEPTANCE", "SCHEDULED", "IN_PROGRESS"],
        },
      },
    });

    // 3. Generate hourly slots within working hours (accounting for buffers)
    const [startHour, startMin] = workingDay.startTime.split(":").map(Number);
    const [endHour, endMin] = workingDay.endTime.split(":").map(Number);

    const bufferMinutes = profile.bufferMinutes || 30;
    const slots: TimeSlot[] = [];

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + 60 <= endMinutes) {
      const slotStartH = Math.floor(currentMinutes / 60);
      const slotStartM = currentMinutes % 60;
      const slotEndH = Math.floor((currentMinutes + 60) / 60);
      const slotEndM = (currentMinutes + 60) % 60;

      const slotStartTime = `${String(slotStartH).padStart(2, "0")}:${String(slotStartM).padStart(2, "0")}`;
      const slotEndTime = `${String(slotEndH).padStart(2, "0")}:${String(slotEndM).padStart(2, "0")}`;

      // Check temporary lock in Redis / memory
      const isLocked = await this.slotLockService.isSlotLocked(
        providerId,
        dateStr,
        slotStartTime
      );

      // Check conflict with existing bookings (including required buffer gap)
      let conflictReason: string | undefined;

      for (const b of existingBookings) {
        const [bStartH, bStartM] = b.startTime.split(":").map(Number);
        const [bEndH, bEndM] = b.endTime.split(":").map(Number);

        const bStartMinutes = bStartH * 60 + bStartM;
        const bEndMinutes = bEndH * 60 + bEndM;

        // Slot overlaps booking or required buffer
        const slotStart = currentMinutes;
        const slotEnd = currentMinutes + 60;

        const effectiveBookingStart = bStartMinutes - bufferMinutes;
        const effectiveBookingEnd = bEndMinutes + bufferMinutes;

        if (slotStart < effectiveBookingEnd && slotEnd > effectiveBookingStart) {
          conflictReason = `Existing booking ${b.bookingCode} with ${bufferMinutes}m buffer gap`;
          break;
        }
      }

      const isAvailable = !isLocked && !conflictReason;

      slots.push({
        startTime: slotStartTime,
        endTime: slotEndTime,
        isAvailable,
        isLocked,
        reason: conflictReason || (isLocked ? "Slot temporarily held by another customer" : undefined),
      });

      // Increment by 60 mins (or step size)
      currentMinutes += 60;
    }

    return slots;
  }

  /**
   * Creates a booking reservation:
   * 1. Atomically applies a temporary slot lock in Redis
   * 2. Checks provider's booking preference (AUTO_CONFIRM vs MANUAL_APPROVAL)
   * 3. Starts 30-min response window if manual approval
   */
  async createBooking(dto: CreateBookingDto) {
    const cleanDateStr = new Date(dto.appointmentDate).toISOString().split("T")[0];

    // 1. Check if an active booking already exists in DB for this provider & slot
    const startOfDay = new Date(cleanDateStr);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(cleanDateStr);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await this.prisma.booking.findFirst({
      where: {
        providerId: dto.providerId,
        appointmentDate: { gte: startOfDay, lte: endOfDay },
        startTime: dto.startTime,
        status: { in: ["PENDING_ACCEPTANCE", "SCHEDULED", "IN_PROGRESS"] },
      },
    });

    if (existingBooking) {
      throw new ConflictException("This time slot is already booked. Please choose another time slot.");
    }

    // 2. Attempt to acquire temporary slot lock
    let lockRes = await this.slotLockService.acquireSlotLock(
      dto.providerId,
      cleanDateStr,
      dto.startTime,
      300
    );

    // If lock failed but NO active booking exists in DB, release stale memory lock and retry
    if (!lockRes.success) {
      this.logger.warn(`Clearing stale slot lock for ${dto.providerId} on ${cleanDateStr} at ${dto.startTime}`);
      await this.slotLockService.releaseSlotLock(this.slotLockService.getLockKey(dto.providerId, cleanDateStr, dto.startTime));
      lockRes = await this.slotLockService.acquireSlotLock(dto.providerId, cleanDateStr, dto.startTime, 300);
    }

    const lockKey = lockRes.lockKey;

    try {
      // 3. Fetch provider & preferences
      const provider = await this.prisma.user.findUnique({
        where: { id: dto.providerId },
        include: { providerProfile: true },
      });

      if (!provider || !provider.providerProfile) {
        throw new NotFoundException("Provider not found");
      }

      const isAutoConfirm = provider.providerProfile.bookingPreference === "AUTO_CONFIRM";
      const initialStatus = isAutoConfirm ? "SCHEDULED" : "PENDING_ACCEPTANCE";
      const deadline = isAutoConfirm
        ? null
        : new Date(Date.now() + 30 * 60 * 1000); // 30-minute response window

      const bookingCode = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
      const appointmentDate = new Date(cleanDateStr);

      // 4. Save booking record in PostgreSQL / SQLite
      const booking = await this.prisma.booking.create({
        data: {
          bookingCode,
          customerId: dto.customerId,
          providerId: dto.providerId,
          serviceCategory: dto.serviceCategory,
          issueDescription: dto.issueDescription,
          appointmentDate,
          startTime: dto.startTime,
          endTime: dto.endTime,
          estimatedPrice: dto.estimatedPrice || provider.providerProfile.hourlyRate,
          status: initialStatus,
          acceptanceDeadline: deadline,
          lockKey,
          statusHistory: {
            create: {
              fromStatus: null,
              toStatus: initialStatus,
              changedBy: isAutoConfirm ? "SYSTEM" : "CUSTOMER",
              note: isAutoConfirm
                ? "Auto-confirmed instantly via Provider Auto-Confirm preference"
                : "Booking created. 30-minute provider acceptance window started.",
            },
          },
        },
        include: {
          customer: { select: { id: true, fullName: true, phone: true } },
          provider: { select: { id: true, fullName: true, phone: true } },
          statusHistory: true,
        },
      });

      // Release temporary lock now that DB record exists
      await this.slotLockService.releaseSlotLock(lockKey);

      // 4. Handle confirmation vs 30-min provider response timer
      if (isAutoConfirm) {
        // Customer notification
        await this.notificationService.sendNotification({
          recipientId: dto.customerId,
          bookingId: booking.id,
          title: "Booking Confirmed! 🎉",
          body: `Aapka booking ${booking.bookingCode} for ${dto.serviceCategory} confirm ho gaya hai!`,
          type: "BOOKING_CONFIRMED",
        });

        // Provider notification
        await this.notificationService.sendNotification({
          recipientId: dto.providerId,
          bookingId: booking.id,
          title: "New Confirmed Job Scheduled",
          body: `New booking ${booking.bookingCode} scheduled for ${dto.appointmentDate} at ${dto.startTime}.`,
          type: "BOOKING_CONFIRMED",
        });

        // Schedule automated reminder
        this.queueService.scheduleAppointmentReminder(
          booking.id,
          appointmentDate,
          dto.startTime
        );
      } else {
        // Manual Approval: Start 30-minute provider response timer
        this.queueService.scheduleProviderAcceptanceDeadline(booking.id, 30);

        // Notify Provider
        await this.notificationService.sendNotification({
          recipientId: dto.providerId,
          bookingId: booking.id,
          title: "New Booking Request! ⚡",
          body: `Naya booking request aaya hai (${booking.serviceCategory}). Aapke paas accept karne ke liye 30 minutes hain!`,
          type: "NEW_BOOKING_REQUEST",
        });

        // Notify Customer
        await this.notificationService.sendNotification({
          recipientId: dto.customerId,
          bookingId: booking.id,
          title: "Booking Request Sent",
          body: `Aapka request bhej diya gaya hai. Provider ke paas response ke liye 30 minutes hain.`,
          type: "NEW_BOOKING_REQUEST",
        });
      }

      return booking;
    } catch (err) {
      // If error occurs during DB creation, release temporary lock
      await this.slotLockService.releaseSlotLock(lockKey);
      throw err;
    }
  }

  /**
   * Provider accepts a pending booking within the 30-minute window
   */
  async acceptBooking(bookingId: string, providerId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.providerId !== providerId) throw new BadRequestException("Unauthorized provider");

    if (booking.status !== "PENDING_ACCEPTANCE") {
      throw new BadRequestException(
        `Cannot accept booking with current status: ${booking.status}`
      );
    }

    // Update status to SCHEDULED
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "SCHEDULED",
        statusHistory: {
          create: {
            fromStatus: "PENDING_ACCEPTANCE",
            toStatus: "SCHEDULED",
            changedBy: "PROVIDER",
            note: "Booking accepted by provider within the 30-minute response window",
          },
        },
      },
      include: {
        customer: true,
        provider: true,
        statusHistory: true,
      },
    });

    // Cancel 30-min response deadline timer
    this.queueService.cancelProviderAcceptanceDeadline(bookingId);

    // Schedule appointment reminder
    this.queueService.scheduleAppointmentReminder(
      booking.id,
      booking.appointmentDate,
      booking.startTime
    );

    // Notify Customer
    await this.notificationService.sendNotification({
      recipientId: booking.customerId,
      bookingId: booking.id,
      title: "Booking Accepted! 🛠️",
      body: `Ustad ne aapka booking request accept kar liya hai! Appointment: ${booking.startTime}`,
      type: "BOOKING_CONFIRMED",
    });

    return updated;
  }

  /**
   * Provider rejects a pending booking
   */
  async rejectBooking(bookingId: string, providerId: string, reason?: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException("Booking not found");
    if (booking.providerId !== providerId) throw new BadRequestException("Unauthorized provider");

    // Update status to REJECTED
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "REJECTED",
        statusHistory: {
          create: {
            fromStatus: booking.status,
            toStatus: "REJECTED",
            changedBy: "PROVIDER",
            note: reason || "Provider was unavailable at this time slot",
          },
        },
      },
    });

    // Release slot lock
    if (booking.lockKey) {
      await this.slotLockService.releaseSlotLock(booking.lockKey);
    }

    // Cancel 30-min timer
    this.queueService.cancelProviderAcceptanceDeadline(bookingId);

    // Notify Customer
    await this.notificationService.sendNotification({
      recipientId: booking.customerId,
      bookingId: booking.id,
      title: "Booking Request Declined",
      body: `Ustad filhal available nahi hain. Tap karein aur doosre top Ustads ko dekhein.`,
      type: "REQUEST_REJECTED",
    });

    return updated;
  }

  /**
   * Reschedules an existing booking to a new valid date/time
   */
  async rescheduleBooking(bookingId: string, dto: RescheduleBookingDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException("Booking not found");

    if (booking.status === "COMPLETED" || booking.status === "CANCELLED" || booking.status === "EXPIRED") {
      throw new BadRequestException(`Cannot reschedule a ${booking.status} booking`);
    }

    // Check availability of proposed replacement slot
    const slots = await this.getAvailableSlots(booking.providerId, dto.newDate);
    const targetSlot = slots.find((s) => s.startTime === dto.newStartTime);

    if (!targetSlot || !targetSlot.isAvailable) {
      throw new ConflictException(
        "Proposed replacement slot is not available. Please choose another time."
      );
    }

    // Acquire lock on replacement slot
    const { success, lockKey } = await this.slotLockService.acquireSlotLock(
      booking.providerId,
      dto.newDate,
      dto.newStartTime,
      300
    );

    if (!success) {
      throw new ConflictException("New time slot is currently locked by another request.");
    }

    // Release previous slot lock
    if (booking.lockKey) {
      await this.slotLockService.releaseSlotLock(booking.lockKey);
    }

    const newAppointmentDate = new Date(dto.newDate);

    // Update appointment details
    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        appointmentDate: newAppointmentDate,
        startTime: dto.newStartTime,
        endTime: dto.newEndTime,
        lockKey,
        rescheduleReason: dto.reason,
        statusHistory: {
          create: {
            fromStatus: booking.status,
            toStatus: booking.status,
            changedBy: dto.requestedBy || "CUSTOMER",
            note: `Rescheduled from ${booking.startTime} to ${dto.newStartTime} on ${dto.newDate}. Reason: ${dto.reason || "None"}`,
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    // Notify both parties
    await this.notificationService.sendNotification({
      recipientId: booking.customerId,
      bookingId: booking.id,
      title: "Booking Rescheduled",
      body: `Aapka booking reschedule ho gaya hai: ${dto.newDate} at ${dto.newStartTime}`,
      type: "RESCHEDULED",
    });

    await this.notificationService.sendNotification({
      recipientId: booking.providerId,
      bookingId: booking.id,
      title: "Booking Rescheduled",
      body: `Appointment rescheduled: ${dto.newDate} at ${dto.newStartTime}`,
      type: "RESCHEDULED",
    });

    return updated;
  }

  /**
   * Manages job lifecycle status transitions:
   * SCHEDULED -> IN_PROGRESS -> COMPLETED (or CANCELLED)
   */
  async updateStatus(bookingId: string, dto: UpdateBookingStatusDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) throw new NotFoundException("Booking not found");

    // Validate state transitions
    const validTransitions: Record<string, string[]> = {
      PENDING_ACCEPTANCE: ["CANCELLED", "REJECTED", "EXPIRED", "SCHEDULED"],
      SCHEDULED: ["IN_PROGRESS", "CANCELLED", "DISPUTED"],
      IN_PROGRESS: ["COMPLETED", "CANCELLED", "DISPUTED"],
      COMPLETED: ["DISPUTED"],
      DISPUTED: ["COMPLETED", "CANCELLED", "IN_PROGRESS"],
      CANCELLED: [],
      EXPIRED: [],
      REJECTED: [],
    };

    const allowed = validTransitions[booking.status] || [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Invalid status transition: cannot move booking from ${booking.status} to ${dto.status}`
      );
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: dto.status,
        ...((dto.status === "CANCELLED" || dto.status === "DISPUTED") && { cancellationReason: dto.reason }),
        statusHistory: {
          create: {
            fromStatus: booking.status,
            toStatus: dto.status,
            changedBy: dto.changedBy || "PROVIDER",
            note: dto.reason || `Status updated to ${dto.status}`,
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    // If cancelled, release slot lock
    if (dto.status === "CANCELLED" && booking.lockKey) {
      await this.slotLockService.releaseSlotLock(booking.lockKey);
      this.queueService.cancelProviderAcceptanceDeadline(bookingId);
    }

    // Send notifications based on transition
    if (dto.status === "IN_PROGRESS") {
      await this.notificationService.sendNotification({
        recipientId: booking.customerId,
        bookingId: booking.id,
        title: "Ustad Arrived & Job Started 🔧",
        body: `Ustad ne kaam shuru kar diya hai. Status: IN PROGRESS`,
        type: "JOB_IN_PROGRESS",
      });
    } else if (dto.status === "COMPLETED") {
      await this.notificationService.sendNotification({
        recipientId: booking.customerId,
        bookingId: booking.id,
        title: "Job Completed Successfully! 🎉",
        body: `Kaam mukammal ho gaya hai. Invoice check karein aur review dein.`,
        type: "JOB_COMPLETED",
      });
      await this.notificationService.sendNotification({
        recipientId: booking.providerId,
        bookingId: booking.id,
        title: "Job Marked Completed 🎉",
        body: `Booking ${booking.bookingCode} status has been updated to COMPLETED.`,
        type: "JOB_COMPLETED",
      });
    } else if (dto.status === "DISPUTED") {
      await this.notificationService.sendNotification({
        recipientId: booking.customerId,
        bookingId: booking.id,
        title: "Dispute Opened ⚠️",
        body: `Dispute filed for ${booking.bookingCode}. Admin support is reviewing the issue.`,
        type: "DISPUTE_RAISED",
      });
      await this.notificationService.sendNotification({
        recipientId: booking.providerId,
        bookingId: booking.id,
        title: "Dispute Opened ⚠️",
        body: `Dispute filed for ${booking.bookingCode}. Admin support is reviewing the issue.`,
        type: "DISPUTE_RAISED",
      });
    }

    return updated;
  }

  /**
   * Find bookings with filters
   */
  async findAll(customerId?: string, providerId?: string, status?: string) {
    const where: any = {};
    if (customerId) where.customerId = customerId;
    if (providerId) where.providerId = providerId;
    if (status) where.status = status;

    return this.prisma.booking.findMany({
      where,
      include: {
        customer: { select: { id: true, fullName: true, phone: true } },
        provider: { select: { id: true, fullName: true, phone: true } },
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  /**
   * Find single booking with complete details
   */
  async findOne(bookingId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            customerProfile: true,
          },
        },
        provider: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            providerProfile: true,
          },
        },
        statusHistory: { orderBy: { createdAt: "asc" } },
        notifications: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!booking) throw new NotFoundException("Booking not found");
    return booking;
  }
}
