import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const visitors = await db
    .collection("rcfCheckins")
    .find({})
    .sort({ date: -1 })
    .toArray();

  const mapped = visitors.map((v) => ({
    id: v._id.toString(),
    name: v.name,
    email: v.email,
    phone: v.phone || "",
    interests: v.interests || [],
    source: v.source || "Website",
    date: v.date,
    status: v.status || "new",
    notes: v.notes || [],
  }));

  return NextResponse.json(mapped);
}
