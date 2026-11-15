import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "file:./dev.db",
    },
  },
});

async function exportData() {
  console.log("📦 Exporting SQLite data...");

  const users = await prisma.user.findMany();
  const customerProfiles = await prisma.customerProfile.findMany();
  const providerProfiles = await prisma.providerProfile.findMany();
  const workingHours = await prisma.workingHours.findMany();
  const bookings = await prisma.booking.findMany();
  const bookingStatusHistories = await prisma.bookingStatusHistory.findMany();
  const notificationLogs = await prisma.notificationLog.findMany();

  const data = {
    exportedAt: new Date().toISOString(),
    counts: {
      users: users.length,
      customerProfiles: customerProfiles.length,
      providerProfiles: providerProfiles.length,
      workingHours: workingHours.length,
      bookings: bookings.length,
      bookingStatusHistories: bookingStatusHistories.length,
      notificationLogs: notificationLogs.length,
    },
    users,
    customerProfiles,
    providerProfiles,
    workingHours,
    bookings,
    bookingStatusHistories,
    notificationLogs,
  };

  const outputPath = path.join(__dirname, "sqlite-backup.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf-8");

  console.log(`✅ Successfully exported to ${outputPath}`);
  console.log("Export summary:", data.counts);
}

exportData()
  .catch((e) => {
    console.error("❌ Export failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
