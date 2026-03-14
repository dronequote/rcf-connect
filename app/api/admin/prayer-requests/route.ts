import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const requests = await db
    .collection("rcfPrayerRequests")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return NextResponse.json(
    requests.map((r) => ({
      id: r._id.toString(),
      memberName: r.memberName,
      memberEmail: r.memberEmail,
      request: r.request,
      isPrivate: r.isPrivate || false,
      status: r.status || "active",
      createdAt: r.createdAt,
    }))
  );
}
