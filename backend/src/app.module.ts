import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "./prisma/prisma.module";
import { RedisModule } from "./redis/redis.module";
import { NotificationModule } from "./notifications/notification.module";
import { QueueModule } from "./queue/queue.module";
import { AuthModule } from "./auth/auth.module";
import { ProvidersModule } from "./providers/providers.module";
import { BookingsModule } from "./bookings/bookings.module";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    NotificationModule,
    QueueModule,
    AuthModule,
    ProvidersModule,
    BookingsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
