/**
 * Seed script: Insert RCF ambassador config into MongoDB
 * Run: MONGODB_URI="your-connection-string" npx tsx scripts/seed-ambassador-config.ts
 */
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("Set MONGODB_URI env var");
  process.exit(1);
}

const RCF_LOCATION_ID = "mhVkT4IdOZj6jHuxoWTZ";

const config = {
  locationId: RCF_LOCATION_ID,
  programName: "RCF Ambassador Program",
  programEnabled: true,
  programType: "points",
  autoApproveAmbassadors: true,
  attributionWindowDays: 90,

  branding: {
    name: "The River Ambassadors",
    logo: "",
    primaryColor: "#1A5632",
    accentColor: "#C8A84E",
    tagline: "Invite your community — earn rewards for every life you touch!",
    supportEmail: "taulger@gmail.com",
  },

  trackableProducts: [
    // Visitor actions that earn points
    {
      productId: "visitor_new",
      productName: "New Visitor Check-in",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 100,
      category: "visitors",
    },
    {
      productId: "visitor_return",
      productName: "Return Visitor (2nd+ visit)",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 50,
      category: "visitors",
    },
    {
      productId: "visitor_connected",
      productName: "Visitor Becomes Connected",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 250,
      category: "milestones",
    },
    {
      productId: "visitor_regular",
      productName: "Visitor Becomes Regular",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 500,
      category: "milestones",
    },
    // Ministry signups
    {
      productId: "signup_smallgroup",
      productName: "Small Group Signup",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 200,
      category: "ministry",
    },
    {
      productId: "signup_volunteer",
      productName: "Volunteer Signup",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 200,
      category: "ministry",
    },
    {
      productId: "signup_agape",
      productName: "Agape Meals Attendance",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 75,
      category: "events",
    },
    // Events
    {
      productId: "event_lake",
      productName: "Church at the Lake Attendance",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 150,
      category: "events",
    },
    {
      productId: "event_retreat",
      productName: "Retreat Registration",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 300,
      category: "events",
    },
    // Giving referrals
    {
      productId: "give_first",
      productName: "Referred First-Time Donor",
      provider: "manual" as const,
      enabled: true,
      rewardType: "points" as const,
      rewardValue: 500,
      category: "giving",
    },
  ],

  rewards: [
    {
      name: "Church Branded T-Shirt",
      description: "Official River Christian Fellowship t-shirt",
      pointCost: 500,
      imageUrl: "",
      active: true,
    },
    {
      name: "Free Coffee for a Month",
      description: "Enjoy free coffee at every Sunday service for a month",
      pointCost: 300,
      imageUrl: "",
      active: true,
    },
    {
      name: "Church at the Lake VIP Spot",
      description: "Reserved front-row spot at the next Church at the Lake event",
      pointCost: 1000,
      imageUrl: "",
      active: true,
    },
    {
      name: "Pastor Lunch Date",
      description: "Private lunch with Pastor Tim — bring your questions!",
      pointCost: 2000,
      imageUrl: "",
      active: true,
    },
    {
      name: "Retreat Scholarship",
      description: "Full scholarship for the next church retreat",
      pointCost: 5000,
      imageUrl: "",
      active: true,
    },
  ],

  promotions: [],

  leaderboard: {
    enabled: true,
    showTopN: 10,
    resetPeriod: "monthly",
    displayMetric: "points",
  },

  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

async function main() {
  const client = new MongoClient(MONGO_URI!);
  try {
    await client.connect();
    const db = client.db("lpai");

    // Upsert config
    const result = await db.collection("rcfAmbassadorConfig").updateOne(
      { locationId: RCF_LOCATION_ID },
      { $set: config },
      { upsert: true }
    );

    console.log(
      result.upsertedCount
        ? "Inserted new RCF ambassador config"
        : "Updated existing RCF ambassador config"
    );
    console.log(`  Location: ${RCF_LOCATION_ID}`);
    console.log(`  Products: ${config.trackableProducts.length}`);
    console.log(`  Rewards: ${config.rewards.length}`);

    // Create indexes
    await db.collection("rcfAmbassadorConfig").createIndex({ locationId: 1 }, { unique: true });
    await db.collection("rcfAmbassadors").createIndex({ locationId: 1, email: 1 }, { unique: true });
    await db.collection("rcfAmbassadors").createIndex({ locationId: 1, slug: 1 }, { unique: true });
    await db.collection("rcfAmbassadorClicks").createIndex({ locationId: 1, ambassadorId: 1 });
    await db.collection("rcfAmbassadorClicks").createIndex({ sessionId: 1 });
    await db.collection("rcfAmbassadorConversions").createIndex({ locationId: 1, ambassadorId: 1 });
    await db.collection("rcfAmbassadorSessions").createIndex({ token: 1 });
    await db.collection("rcfAmbassadorSessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await db.collection("rcfAmbassadorAuthTokens").createIndex({ token: 1 });
    await db.collection("rcfAmbassadorAuthTokens").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    await db.collection("rcfAmbassadorRedemptions").createIndex({ locationId: 1, ambassadorId: 1 });

    console.log("Indexes created for all ambassador collections");
  } finally {
    await client.close();
  }
}

main().catch(console.error);
