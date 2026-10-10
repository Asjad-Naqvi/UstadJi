import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { BookingsService } from "./bookings.service";
import {
  CreateBookingDto,
  RescheduleBookingDto,
  UpdateBookingStatusDto,
} from "./dto/booking.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("bookings")
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * GET /bookings/availability/:providerId?date=YYYY-MM-DD
   * Synchronizes and calculates real-time provider available slots
   */
  @Get("availability/:providerId")
  async getAvailability(
    @Param("providerId") providerId: string,
    @Query("date") date: string
  ) {
    const targetDate = date || new Date().toISOString().split("T")[0];
    return this.bookingsService.getAvailableSlots(providerId, targetDate);
  }

  /**
   * POST /bookings
   * Creates a booking, applies temporary slot lock, handles auto vs manual approval
   */
  @Post()
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(dto);
  }

  /**
   * GET /bookings
   * List bookings filtered by customer, provider, or status
   */
  @Get()
  async getBookings(
    @Query("customerId") customerId?: string,
    @Query("providerId") providerId?: string,
    @Query("status") status?: string
  ) {
    return this.bookingsService.findAll(customerId, providerId, status);
  }

  /**
   * GET /bookings/:id
   * Complete booking details with status transition history
   */
  @Get(":id")
  async getBooking(@Param("id") id: string) {
    return this.bookingsService.findOne(id);
  }

  /**
   * PATCH /bookings/:id/accept
   * Provider accepts booking within 30-min window
   */
  @Patch(":id/accept")
  async acceptBooking(
    @Param("id") id: string,
    @Body("providerId") providerId: string
  ) {
    return this.bookingsService.acceptBooking(id, providerId);
  }

  /**
   * PATCH /bookings/:id/reject
   * Provider rejects booking
   */
  @Patch(":id/reject")
  async rejectBooking(
    @Param("id") id: string,
    @Body() body: { providerId: string; reason?: string }
  ) {
    return this.bookingsService.rejectBooking(id, body.providerId, body.reason);
  }

  /**
   * POST /bookings/:id/reschedule
   * Reschedules appointment to new slot with lock validation
   */
  @Post(":id/reschedule")
  async rescheduleBooking(
    @Param("id") id: string,
    @Body() dto: RescheduleBookingDto
  ) {
    return this.bookingsService.rescheduleBooking(id, dto);
  }

  /**
   * PATCH /bookings/:id/status
   * Job lifecycle progress: SCHEDULED -> IN_PROGRESS -> COMPLETED (or CANCELLED)
   */
  @Patch(":id/status")
  async updateStatus(
    @Param("id") id: string,
    @Body() dto: UpdateBookingStatusDto
  ) {
    return this.bookingsService.updateStatus(id, dto);
  }
}
