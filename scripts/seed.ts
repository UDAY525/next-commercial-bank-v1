import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import mongoose from "mongoose";

import User from "../src/models/User";
import Donation from "../src/models/Donation";
import RequestGrants from "../src/models/RequestGrants";
import BloodTransactions from "../src/models/BloodTransactions";

const BLOOD_GROUPS = [
  "O+",
  "O-",
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
] as const;

const REQUEST_STATUSES = ["pending", "granted"] as const;

function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomPastDate(days = 45) {
  return new Date(Date.now() - randomInt(1, days) * 24 * 60 * 60 * 1000);
}

async function seed() {
  console.log("🌱 Starting database seed...");

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI missing");
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("✅ MongoDB connected");

  // 🧹 CLEAN DATABASE
  await Promise.all([
    User.deleteMany({}),
    Donation.deleteMany({}),
    RequestGrants.deleteMany({}),
    BloodTransactions.deleteMany({}),
  ]);

  // 👤 USERS (20)
  const users = await User.insertMany(
    Array.from({ length: 20 }).map((_, i) => ({
      name: `Demo User ${i + 1}`,
      email: `demo${i + 1}@example.com`,
      phone: `90000000${i}`,
      bloodGroup: randomFrom(BLOOD_GROUPS),
      isProfileCompleted: true,
      isDummy: true,
      createdAt: randomPastDate(60),
    })),
  );

  console.log("👤 Users seeded");

  // 🩸 DONATIONS (40)
  const donations = await Donation.insertMany(
    Array.from({ length: 40 }).map(() => {
      const user = randomFrom(users);
      return {
        donarId: user._id,
        name: user.name,
        donatedBloodGroup: user.bloodGroup,
        quantity: randomInt(100, 200),
        isDummy: true,
        createdAt: randomPastDate(),
      };
    }),
  );

  console.log("🩸 Donations seeded");

  // 📊 BLOOD TRANSACTIONS — IN (from donations)
  await BloodTransactions.insertMany(
    donations.map((d) => ({
      userId: d.donarId,
      bloodGroup: d.donatedBloodGroup,
      type: "IN",
      quantity: d.quantity,
      source: "DONATION",
      isDummy: true,
      createdAt: d.createdAt,
    })),
  );

  console.log("📊 IN transactions seeded");

  // 🆘 REQUEST GRANTS (25)
  const requests = await RequestGrants.insertMany(
    Array.from({ length: 25 }).map(() => {
      const user = randomFrom(users);
      return {
        userId: user._id,
        name: user.name,
        phone: user.phone,
        bloodGroup: randomFrom(BLOOD_GROUPS),
        quantity: randomInt(100, 200),
        status: randomFrom(REQUEST_STATUSES),
        isDummy: true,
        createdAt: randomPastDate(),
      };
    }),
  );

  console.log("🆘 Requests seeded");

  // 📉 BLOOD TRANSACTIONS — OUT (only fulfilled requests)
  const fulfilled = requests.filter((r) => r.status === "FULFILLED");

  await BloodTransactions.insertMany(
    fulfilled.map((r) => ({
      userId: r.userId,
      bloodGroup: r.bloodGroup,
      type: "OUT",
      quantity: r.quantity,
      source: "REQUEST",
      isDummy: true,
      createdAt: r.createdAt,
    })),
  );

  console.log("📉 OUT transactions seeded");

  console.log("✅ SEEDING COMPLETE");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ SEED FAILED", err);
  process.exit(1);
});
