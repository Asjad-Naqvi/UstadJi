import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class SignUpDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN";

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  trade?: string;

  @IsOptional()
  hourlyRate?: number;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
