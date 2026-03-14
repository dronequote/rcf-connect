import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const checkins = await db
    .collection("rcfAgapeCheckins")
    .find({})
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();

  return NextResponse.json(
    checkins.map((c) => ({
      id: c._id.toString(),
      family: c.family,
      count: c.count,
      time: c.time,
      date: c.date,
      createdAt: c.createdAt,
    }))
  );
}

export async function POST(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { family, count } = await request.json();

  if (!family?.trim() || !count || count < 1) {
    return NextResponse.json({ error: "Family name and count required" }, { status: 400 });
  }

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const now = new Date();
  const checkin = {
    family: family.trim(),
    count: Number(count),
    time: now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    date: now.toISOString().slice(0, 10),
    createdAt: now.toISOString(),
  };

  await db.collection("rcfAgapeCheckins").insertOne(checkin);

  // Update meals served in stats
  await db.collection("rcfSettings").updateOne(
    { key: "dashboardStats" },
    { $inc: { "value.mealsServed": Number(count) } }
  );

  return NextResponse.json({ success: true, checkin });
}
