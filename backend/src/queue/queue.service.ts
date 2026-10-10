import { Injectable, Logger, OnModuleInit, OnModuleDestroy, forwardRef, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SlotLockService } from "../redis/slot-lock.service";
import { NotificationService } from "../notifications/notification.service";

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(QueueService.name);
  private activeTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly slotLockService: SlotLockService,
    private readonly notificationService: NotificationService
  ) {}

  onModuleInit() {
    this.logger.log("⏱️ QueueService initialized for 30-minute response deadlines & reminders");
  }

  onModuleDestroy() {
    for (const timer of this.activeTimers.values()) {
      clearTimeout(timer);
    }
    this.activeTimers.clear();
  }

  /**
   * Schedules a 30-minute response deadline job for a booking
   */
  scheduleProviderAcceptanceDeadline(bookingId: string, timeoutMinutes = 30) {
    const timerKey = `expiry:${bookingId}`;
    if (this.activeTimers.has(timerKey)) {
      clearTimeout(this.activeTimers.get(timerKey)!);
    }

    const delayMs = timeoutMinutes * 60 * 1000;
    this.logger.log(`⏳ Scheduled 30-min acceptance timer for Booking [${bookingId}] (fires in ${timeoutMinutes}m)`);

    const timer = setTimeout(async () => {
      await this.handleBookingExpiry(bookingId);
      this.activeTimers.delete(timerKey);
    }, delayMs);

    this.activeTimers.set(timerKey, timer);
  }

  /**
   * Cancels a pending 30-minute acceptance deadline when provider accepts/rejects
   */
  cancelProviderAcceptanceDeadline(bookingId: string) {
    const timerKey = `expiry:${bookingId}`;
    if (this.activeTimers.has(timerKey)) {
      clearTimeout(this.activeTimers.get(timerKey)!);
      this.activeTimers.delete(timerKey);
      this.logger.log(`⏹️ Cancelled acceptance timer for Booking [${bookingId}]`);
    }
  }

  /**
   * Background execution when 30-minute provider response window times out
   */
  async handleBookingExpiry(bookingId: string) {
    try {
      this.logger.warn(`⌛ 30-min window expired for Booking [${bookingId}]. Processing automatic timeout...`);

      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        include: { customer: true, provider: true },
      });

      if (!booking || booking.status !== "PENDING_ACCEPTANCE") {
        this.logger.log(`Booking [${bookingId}] is no longer PENDING_ACCEPTANCE (current: ${booking?.status}). Skipping.`);
        return;
      }

      // 1. Update status to EXPIRED
      const updated = await this.prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "EXPIRED",
          statusHistory: {
            create: {
              fromStatus: "PENDING_ACCEPTANCE",
              toStatus: "EXPIRED",
              changedBy: "SYSTEM",
              note: "Provider did not respond within the 30-minute window. Request automatically expired.",
            },
          },
        },
      });

      // 2. Release temporary slot lock
      if (booking.lockKey) {
        await this.slotLockService.releaseSlotLock(booking.lockKey);
      }

      // 3. Notify Customer
      await this.notificationService.sendNotification({
        recipientId: booking.customerId,
        bookingId: booking.id,
        title: "Booking Request Expired",
        body: `Ustad ne 30 minutes mein respond nahi kiya. Hum aapko alternative verified Ustads recommend kar rahe hain.`,
        type: "REQUEST_EXPIRED",
      });

      // 4. Notify Provider of missed booking
      await this.notificationService.sendNotification({
        recipientId: booking.providerId,
        bookingId: booking.id,
        title: "Missed Booking Request",
        body: `Booking ${booking.bookingCode} expired because it was not accepted within 30 minutes.`,
        type: "REQUEST_EXPIRED",
      });

      this.logger.log(`✅ Booking [${bookingId}] successfully expired and slot released.`);
    } catch (err) {
      this.logger.error(`Error handling booking expiry: ${(err as Error).message}`);
    }
  }

  /**
   * Schedules automated push notification appointment reminder
   */
  scheduleAppointmentReminder(bookingId: string, appointmentDate: Date, startTime: string) {
    const [hours, minutes] = startTime.split(":").map(Number);
    const jobTime = new Date(appointmentDate);
    jobTime.setHours(hours - 2, minutes, 0, 0); // 2 hours before

    const delayMs = jobTime.getTime() - Date.now();
    if (delayMs <= 0) return; // In the past

    const timerKey = `reminder:${bookingId}`;
    const timer = setTimeout(async () => {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
      });

      if (booking && booking.status === "SCHEDULED") {
        await this.notificationService.sendNotification({
          recipientId: booking.customerId,
          bookingId: booking.id,
          title: "Upcoming Appointment Reminder",
          body: `Aapka appointment aaj ${startTime} baje schedule hai!`,
          type: "REMINDER",
        });

        await this.notificationService.sendNotification({
          recipientId: booking.providerId,
          bookingId: booking.id,
          title: "Job Appointment Reminder",
          body: `Job reminder: Appointment scheduled for ${startTime}. Tayyar rahein!`,
          type: "REMINDER",
        });
      }
      this.activeTimers.delete(timerKey);
    }, delayMs);

    this.activeTimers.set(timerKey, timer);
  }
}
