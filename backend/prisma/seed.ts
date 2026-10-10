import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with dummy data...");

  // Clear existing
  await prisma.notificationLog.deleteMany();
  await prisma.bookingStatusHistory.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.workingHours.deleteMany();
  await prisma.providerProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 10);
  const adminHashedPassword = await bcrypt.hash("adminpassword", 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      email: "admin@ustadji.pk",
      phone: "+923001112233",
      password: adminHashedPassword,
      fullName: "UstadJi Admin",
      role: "ADMIN",
    },
  });

  // 2. Create Customer 1 (Zain Khan)
  const customer1 = await prisma.user.create({
    data: {
      email: "zain@ustadji.pk",
      phone: "+923005551234",
      password: hashedPassword,
      fullName: "Zain Khan",
      role: "CUSTOMER",
      customerProfile: {
        create: {
          address: "House 24, Street 12, Sector F-7/2",
          sector: "F-7/2",
          city: "Islamabad",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      },
    },
  });

  // 3. Create Customer 2 (Ayesha Malik)
  const customer2 = await prisma.user.create({
    data: {
      email: "ayesha@ustadji.pk",
      phone: "+923005555678",
      password: hashedPassword,
      fullName: "Ayesha Malik",
      role: "CUSTOMER",
      customerProfile: {
        create: {
          address: "Apartment 4B, Sector G-11/1",
          sector: "G-11/1",
          city: "Islamabad",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        },
      },
    },
  });

  // 4. Create Provider 1 (Ustad Tariq - Master Plumber, Manual Approval)
  const provider1User = await prisma.user.create({
    data: {
      email: "tariq@ustadji.pk",
      phone: "+923331112233",
      password: hashedPassword,
      fullName: "Ustad Tariq Mehmood",
      role: "PROVIDER",
    },
  });

  const provider1 = await prisma.providerProfile.create({
    data: {
      userId: provider1User.id,
      trade: "Master Plumber",
      experienceYears: 12,
      hourlyRate: 800.0,
      rating: 4.9,
      reviewCount: 128,
      sectorsCovered: "F-6, F-7, F-8, G-9, Blue Area",
      isVerified: true,
      bookingPreference: "MANUAL_APPROVAL",
      bufferMinutes: 30,
      workingHours: {
        create: [1, 2, 3, 4, 5, 6].map((day) => ({
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
          isWorkingDay: true,
        })),
      },
    },
  });

  // 5. Create Provider 2 (Ustad Rashid - HVAC Expert, Auto Confirm)
  const provider2User = await prisma.user.create({
    data: {
      email: "rashid@ustadji.pk",
      phone: "+923334445566",
      password: hashedPassword,
      fullName: "Ustad Rashid Ali",
      role: "PROVIDER",
    },
  });

  const provider2 = await prisma.providerProfile.create({
    data: {
      userId: provider2User.id,
      trade: "HVAC & AC Expert",
      experienceYears: 9,
      hourlyRate: 1000.0,
      rating: 4.8,
      reviewCount: 94,
      sectorsCovered: "G-10, G-11, F-10, F-11",
      isVerified: true,
      bookingPreference: "AUTO_CONFIRM",
      bufferMinutes: 30,
      workingHours: {
        create: [1, 2, 3, 4, 5, 6].map((day) => ({
          dayOfWeek: day,
          startTime: "08:00",
          endTime: "17:00",
          isWorkingDay: true,
        })),
      },
    },
  });

  // 6. Create Provider 3 (Ustad Bilal - Electrician)
  const provider3User = await prisma.user.create({
    data: {
      email: "bilal@ustadji.pk",
      phone: "+923337778899",
      password: hashedPassword,
      fullName: "Ustad Bilal Ahmad",
      role: "PROVIDER",
    },
  });

  const provider3 = await prisma.providerProfile.create({
    data: {
      userId: provider3User.id,
      trade: "Master Electrician",
      experienceYears: 7,
      hourlyRate: 750.0,
      rating: 4.9,
      reviewCount: 76,
      sectorsCovered: "F-6, F-7, G-7, Rawalpindi",
      isVerified: true,
      bookingPreference: "MANUAL_APPROVAL",
      bufferMinutes: 30,
      workingHours: {
        create: [1, 2, 3, 4, 5, 6].map((day) => ({
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "19:00",
          isWorkingDay: true,
        })),
      },
    },
  });

  // 7. Create Provider 4 (Ustad Muhammad Aslam - Carpenter)
  const provider4User = await prisma.user.create({
    data: {
      email: "aslam@ustadji.pk",
      phone: "+923332221100",
      password: hashedPassword,
      fullName: "Ustad Muhammad Aslam",
      role: "PROVIDER",
    },
  });

  const provider4 = await prisma.providerProfile.create({
    data: {
      userId: provider4User.id,
      trade: "Master Carpenter & Woodwork",
      experienceYears: 15,
      hourlyRate: 900.0,
      rating: 4.8,
      reviewCount: 112,
      sectorsCovered: "I-8, H-8, Rawalpindi, F-8",
      isVerified: true,
      bookingPreference: "MANUAL_APPROVAL",
      bufferMinutes: 30,
      workingHours: {
        create: [1, 2, 3, 4, 5, 6].map((day) => ({
          dayOfWeek: day,
          startTime: "09:00",
          endTime: "18:00",
          isWorkingDay: true,
        })),
      },
    },
  });

  // 8. Create Provider 5 (Ustad Noman Qureshi - Painter)
  const provider5User = await prisma.user.create({
    data: {
      email: "noman@ustadji.pk",
      phone: "+923338884422",
      password: hashedPassword,
      fullName: "Ustad Noman Qureshi",
      role: "PROVIDER",
    },
  });

  const provider5 = await prisma.providerProfile.create({
    data: {
      userId: provider5User.id,
      trade: "Painter & Finishing Specialist",
      experienceYears: 8,
      hourlyRate: 700.0,
      rating: 4.7,
      reviewCount: 65,
      sectorsCovered: "F-7, F-8, Blue Area, G-9",
      isVerified: true,
      bookingPreference: "AUTO_CONFIRM",
      bufferMinutes: 30,
      workingHours: {
        create: [1, 2, 3, 4, 5, 6].map((day) => ({
          dayOfWeek: day,
          startTime: "08:30",
          endTime: "17:30",
          isWorkingDay: true,
        })),
      },
    },
  });

  // 9. Create Customer 3 (Hamza Abbasi)
  const customer3 = await prisma.user.create({
    data: {
      email: "hamza@ustadji.pk",
      phone: "+923005559900",
      password: hashedPassword,
      fullName: "Hamza Abbasi",
      role: "CUSTOMER",
      customerProfile: {
        create: {
          address: "Villa 12, Sector E-11/3",
          sector: "E-11/3",
          city: "Islamabad",
          avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        },
      },
    },
  });

  // 10. Create Customer 4 (Fatima Zahra)
  const customer4 = await prisma.user.create({
    data: {
      email: "fatima@ustadji.pk",
      phone: "+923005557788",
      password: hashedPassword,
      fullName: "Fatima Zahra",
      role: "CUSTOMER",
      customerProfile: {
        create: {
          address: "House 55, Street 4, Sector F-10/2",
          sector: "F-10/2",
          city: "Islamabad",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
        },
      },
    },
  });

  // 11. Create Sample Active & Past Bookings
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const booking1 = await prisma.booking.create({
    data: {
      bookingCode: "BK-1001",
      customerId: customer1.id,
      providerId: provider1User.id,
      serviceCategory: "Plumbing",
      issueDescription: "Main water pipe valve leaking in kitchen",
      appointmentDate: tomorrow,
      startTime: "10:00",
      endTime: "11:00",
      estimatedPrice: 800.0,
      status: "SCHEDULED",
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: "PENDING_ACCEPTANCE",
            changedBy: "CUSTOMER",
            note: "Booking request created by Zain Khan",
          },
          {
            fromStatus: "PENDING_ACCEPTANCE",
            toStatus: "SCHEDULED",
            changedBy: "PROVIDER",
            note: "Accepted by Ustad Tariq within 12 minutes",
          },
        ],
      },
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      bookingCode: "BK-1002",
      customerId: customer2.id,
      providerId: provider2User.id,
      serviceCategory: "AC Repair",
      issueDescription: "AC not cooling, compressor making clicking noise",
      appointmentDate: tomorrow,
      startTime: "14:00",
      endTime: "15:00",
      estimatedPrice: 1000.0,
      status: "SCHEDULED",
      statusHistory: {
        create: [
          {
            fromStatus: null,
            toStatus: "SCHEDULED",
            changedBy: "SYSTEM",
            note: "Auto-confirmed instantly via Provider Auto-Confirm preference",
          },
        ],
      },
    },
  });

  console.log("✅ Seed completed successfully!");
  console.log("-----------------------------------------");
  console.log("Demo Credentials:");
  console.log("Customer 1: zain@ustadji.pk / password123 (Zain Khan)");
  console.log("Customer 2: ayesha@ustadji.pk / password123 (Ayesha Malik)");
  console.log("Customer 3: hamza@ustadji.pk / password123 (Hamza Abbasi)");
  console.log("Customer 4: fatima@ustadji.pk / password123 (Fatima Zahra)");
  console.log("Provider 1 (Manual): tariq@ustadji.pk / password123 (Ustad Tariq - Plumber)");
  console.log("Provider 2 (Auto):   rashid@ustadji.pk / password123 (Ustad Rashid - HVAC)");
  console.log("Provider 3 (Manual): bilal@ustadji.pk / password123 (Ustad Bilal - Electrician)");
  console.log("Provider 4 (Manual): aslam@ustadji.pk / password123 (Ustad Aslam - Carpenter)");
  console.log("Provider 5 (Auto):   noman@ustadji.pk / password123 (Ustad Noman - Painter)");
  console.log("Admin:      admin@ustadji.pk / adminpassword");
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
