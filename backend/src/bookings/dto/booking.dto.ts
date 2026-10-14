import { IsNotEmpty, IsOptional, IsString, IsNumber, IsDateString } from "class-validator";

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  customerId: string;

  @IsNotEmpty()
  @IsString()
  providerId: string;

  @IsNotEmpty()
  @IsString()
  serviceCategory: string;

  @IsNotEmpty()
  @IsString()
  issueDescription: string;

  @IsNotEmpty()
  @IsString()
  appointmentDate: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  startTime: string; // HH:mm

  @IsNotEmpty()
  @IsString()
  endTime: string; // HH:mm

  @IsOptional()
  @IsNumber()
  estimatedPrice?: number;
}

export class RescheduleBookingDto {
  @IsNotEmpty()
  @IsString()
  newDate: string; // YYYY-MM-DD

  @IsNotEmpty()
  @IsString()
  newStartTime: string; // HH:mm

  @IsNotEmpty()
  @IsString()
  newEndTime: string; // HH:mm

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  requestedBy?: "CUSTOMER" | "PROVIDER";
}

export class UpdateBookingStatusDto {
  @IsNotEmpty()
  @IsString()
  status: "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "DISPUTED";

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  changedBy?: "CUSTOMER" | "PROVIDER" | "ADMIN";
}
