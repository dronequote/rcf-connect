import { NextResponse } from "next/server";
import { validateSession } from "@/lib/ambassador";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "token query param required" }, { status: 400 });
    }

    const result = await validateSession(token);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
