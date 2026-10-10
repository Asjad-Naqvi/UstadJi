import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProvidersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(trade?: string, sector?: string) {
    const where: any = {
      role: "PROVIDER",
    };

    const providers = await this.prisma.user.findMany({
      where,
      include: {
        providerProfile: {
          include: {
            workingHours: true,
          },
        },
      },
    });

    return providers
      .filter((p) => p.providerProfile !== null)
      .filter((p) => (!trade ? true : p.providerProfile?.trade.toLowerCase().includes(trade.toLowerCase())))
      .filter((p) => (!sector ? true : p.providerProfile?.sectorsCovered.toLowerCase().includes(sector.toLowerCase())))
      .map((p) => {
        const { password, ...safeUser } = p;
        return safeUser;
      });
  }

  async findOne(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        providerProfile: {
          include: {
            workingHours: true,
          },
        },
      },
    });

    if (!user || !user.providerProfile) {
      throw new NotFoundException("Provider not found");
    }

    const { password, ...safeUser } = user;
    return safeUser;
  }

  async updatePreferences(
    userId: string,
    data: {
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
    const provider = await this.prisma.providerProfile.findUnique({
      where: { userId },
    });

    if (!provider) {
      throw new NotFoundException("Provider profile not found");
    }

    // Update base preferences
    await this.prisma.providerProfile.update({
      where: { userId },
      data: {
        ...(data.bookingPreference && { bookingPreference: data.bookingPreference }),
        ...(data.bufferMinutes !== undefined && { bufferMinutes: data.bufferMinutes }),
      },
    });

    // Update working hours if provided
    if (data.workingHours && data.workingHours.length > 0) {
      for (const wh of data.workingHours) {
        await this.prisma.workingHours.upsert({
          where: {
            providerId_dayOfWeek: {
              providerId: provider.id,
              dayOfWeek: wh.dayOfWeek,
            },
          },
          update: {
            startTime: wh.startTime,
            endTime: wh.endTime,
            isWorkingDay: wh.isWorkingDay,
          },
          create: {
            providerId: provider.id,
            dayOfWeek: wh.dayOfWeek,
            startTime: wh.startTime,
            endTime: wh.endTime,
            isWorkingDay: wh.isWorkingDay,
          },
        });
      }
    }

    return this.findOne(userId);
  }
}
