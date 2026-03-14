import { NextResponse } from "next/server";
import { getConfig } from "@/lib/ambassador";

export async function GET() {
  try {
    const config = await getConfig();
    if (!config) return NextResponse.json({ error: "Config not found" }, { status: 404 });
    return NextResponse.json(config);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
