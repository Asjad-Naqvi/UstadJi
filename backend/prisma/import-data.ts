import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function importData() {
  const backupPath = path.join(__dirname, "sqlite-backup.json");
  if (!fs.existsSync(backupPath)) {
    throw new Error(`Backup file not found at: ${backupPath}`);
  }

  console.log("📥 Loading backup file...");
  const raw = fs.readFileSync(backupPath, "utf-8");
  const data = JSON.parse(raw);

  console.log("Summary of records to import:", data.counts);

  console.log("🧹 Clearing target database...");
  await prisma.notificationLog.deleteMany();
  await prisma.bookingStatusHistory.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Importing Users...");
  for (const user of data.users) {
    await prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        password: user.password,
        fullName: user.fullName,
        role: user.role,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      },
    });
  }

  console.log("👥 Importing Customer Profiles...");
  for (const cp of data.customerProfiles) {
    await prisma.customerProfile.create({
      data: {
        id: cp.id,
        userId: cp.userId,
        address: cp.address,
        sector: cp.sector,
        city: cp.city,
        avatarUrl: cp.avatarUrl,
        createdAt: new Date(cp.createdAt),
        updatedAt: new Date(cp.updatedAt),
      },
    });
  }

  console.log("🔧 Importing Provider Profiles...");
  for (const pp of data.providerProfiles) {
    await prisma.providerProfile.create({
      data: {
        id: pp.id,
        userId: pp.userId,
        trade: pp.trade,
        experienceYears: pp.experienceYears,
        hourlyRate: pp.hourlyRate,
        rating: pp.rating,
        reviewCount: pp.reviewCount,
        sectorsCovered: pp.sectorsCovered,
        isVerified: pp.isVerified,
        bookingPreference: pp.bookingPreference,
        bufferMinutes: pp.bufferMinutes,
        createdAt: new Date(pp.createdAt),
        updatedAt: new Date(pp.updatedAt),
      },
    });
  }

  console.log("⏰ Importing Working Hours...");
  for (const wh of data.workingHours) {
    await prisma.workingHours.create({
      data: {
        id: wh.id,
        providerId: wh.providerId,
        dayOfWeek: wh.dayOfWeek,
        startTime: wh.startTime,
        endTime: wh.endTime,
        isWorkingDay: wh.isWorkingDay,
        createdAt: new Date(wh.createdAt),
        updatedAt: new Date(wh.updatedAt),
      },
    });
  }

  console.log("📅 Importing Bookings...");
  for (const b of data.bookings) {
    await prisma.booking.create({
      data: {
        id: b.id,
        bookingCode: b.bookingCode,
        customerId: b.customerId,
        providerId: b.providerId,
        serviceCategory: b.serviceCategory,
        issueDescription: b.issueDescription,
        appointmentDate: new Date(b.appointmentDate),
        startTime: b.startTime,
        endTime: b.endTime,
        estimatedPrice: b.estimatedPrice,
        status: b.status,
        acceptanceDeadline: b.acceptanceDeadline ? new Date(b.acceptanceDeadline) : null,
        lockKey: b.lockKey,
        rescheduledFromId: b.rescheduledFromId,
        rescheduleReason: b.rescheduleReason,
        cancellationReason: b.cancellationReason,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt),
      },
    });
  }

  console.log("📜 Importing Booking Status Histories...");
  for (const bsh of data.bookingStatusHistories) {
    await prisma.bookingStatusHistory.create({
      data: {
        id: bsh.id,
        bookingId: bsh.bookingId,
        fromStatus: bsh.fromStatus,
        toStatus: bsh.toStatus,
        changedBy: bsh.changedBy,
        note: bsh.note,
        createdAt: new Date(bsh.createdAt),
      },
    });
  }

  console.log("🔔 Importing Notification Logs...");
  for (const nl of data.notificationLogs) {
    await prisma.notificationLog.create({
      data: {
        id: nl.id,
        recipientId: nl.recipientId,
        bookingId: nl.bookingId,
        title: nl.title,
        body: nl.body,
        channel: nl.channel,
        type: nl.type,
        isRead: nl.isRead,
        createdAt: new Date(nl.createdAt),
      },
    });
  }

  console.log("🎉 All data successfully migrated into target database!");
}

importData()
  .catch((e) => {
    console.error("❌ Import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
