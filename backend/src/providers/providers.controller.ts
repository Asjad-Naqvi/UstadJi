import { Controller, Get, Patch, Param, Body, Query, UseGuards } from "@nestjs/common";
import { ProvidersService } from "./providers.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("providers")
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Get()
  async getProviders(
    @Query("trade") trade?: string,
    @Query("sector") sector?: string
  ) {
    return this.providersService.findAll(trade, sector);
  }

  @Get(":id")
  async getProvider(@Param("id") id: string) {
    return this.providersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id/preferences")
  async updatePreferences(
    @Param("id") id: string,
    @Body()
    body: {
      bookingPreference?: "AUTO_CONFIRM" | "MANUAL_APPROVAL";
      bufferMinutes?: number;
      workingHours?: {
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorkingDay: boolean;
      }[];
    }
  ) {
    return this.providersService.updatePreferences(id, body);
  }
}
