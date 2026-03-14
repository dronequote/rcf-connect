import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/ambassador";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || undefined;

    const result = await getLeaderboard(period);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
