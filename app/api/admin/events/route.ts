import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";
import { requireStaffAuth } from "@/lib/auth-utils";

export async function GET(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const doc = await db.collection("rcfEvents").findOne({});
  if (!doc) return NextResponse.json({ summer: [], upcoming: [], weekly: [] });

  return NextResponse.json({
    id: doc._id.toString(),
    summer: doc.summer || [],
    upcoming: doc.upcoming || [],
    weekly: doc.weekly || [],
  });
}

export async function PUT(request: Request) {
  const staff = await requireStaffAuth(request);
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { summer, upcoming, weekly } = body;

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Database unavailable" }, { status: 500 });

  const existing = await db.collection("rcfEvents").findOne({});

  if (existing) {
    await db.collection("rcfEvents").updateOne(
      { _id: existing._id },
      {
        $set: {
          ...(summer !== undefined && { summer }),
          ...(upcoming !== undefined && { upcoming }),
          ...(weekly !== undefined && { weekly }),
          updatedAt: new Date().toISOString(),
        },
      }
    );
  } else {
    await db.collection("rcfEvents").insertOne({
      summer: summer || [],
      upcoming: upcoming || [],
      weekly: weekly || [],
      createdAt: new Date().toISOString(),
    });
  }

  revalidatePath("/connect/events");
  revalidatePath("/member/events");

  return NextResponse.json({ success: true });
}
