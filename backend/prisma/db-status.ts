import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("=".repeat(55));
  console.log("        USTADJI POSTGRESQL DATABASE STATUS");
  console.log("=".repeat(55));

  const start = Date.now();
  await prisma.$connect();
  const latency = Date.now() - start;

  console.log(`Connection:   CONNECTED (Neon Cloud PostgreSQL)`);
  console.log(`Ping / RTT:   ${latency} ms`);
  console.log("-".repeat(55));

  const [
    users,
    customerProfiles,
    providerProfiles,
    workingHours,
    bookings,
    statusHistories,
    notifications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.customerProfile.count(),
    prisma.providerProfile.count(),
    prisma.workingHours.count(),
    prisma.booking.count(),
    prisma.bookingStatusHistory.count(),
    prisma.notificationLog.count(),
  ]);

  const rows = [
    { Table: "User", Records: users },
    { Table: "CustomerProfile", Records: customerProfiles },
    { Table: "ProviderProfile", Records: providerProfiles },
    { Table: "WorkingHours", Records: workingHours },
    { Table: "Booking", Records: bookings },
    { Table: "BookingStatusHistory", Records: statusHistories },
    { Table: "NotificationLog", Records: notifications },
  ];

  console.table(rows);
  console.log("=".repeat(55));
  console.log("Status:       HEALTHY & FULLY OPERATIONAL 🚀");
  console.log("=".repeat(55));
}

main()
  .catch((e) => {
    console.error("❌ Database Error:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
