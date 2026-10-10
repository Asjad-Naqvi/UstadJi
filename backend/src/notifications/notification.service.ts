import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface SendNotificationDto {
  recipientId: string;
  bookingId?: string;
  title: string;
  body: string;
  type: string;
  expoPushToken?: string;
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Sends a push notification (via Expo Push API) and saves to database log
   */
  async sendNotification(dto: SendNotificationDto) {
    this.logger.log(
      `📲 [NOTIFICATION] To: ${dto.recipientId} | Type: ${dto.type} | Title: "${dto.title}" | Body: "${dto.body}"`
    );

    // Save permanent record to PostgreSQL / SQLite
    const record = await this.prisma.notificationLog.create({
      data: {
        recipientId: dto.recipientId,
        bookingId: dto.bookingId,
        title: dto.title,
        body: dto.body,
        type: dto.type,
        channel: "EXPO_PUSH",
      },
    });

    // If Expo push token is provided, forward to Expo Push Gateway
    if (dto.expoPushToken && dto.expoPushToken.startsWith("ExponentPushToken")) {
      try {
        await fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Accept-encoding": "gzip, deflate",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: dto.expoPushToken,
            sound: "default",
            title: dto.title,
            body: dto.body,
            data: { bookingId: dto.bookingId, type: dto.type },
          }),
        });
      } catch (err) {
        this.logger.warn(`Could not dispatch to Expo gateway: ${(err as Error).message}`);
      }
    }

    return record;
  }

  async getUserNotifications(userId: string) {
    return this.prisma.notificationLog.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }
}
