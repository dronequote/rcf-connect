import { NextResponse } from "next/server";
import { redeemReward } from "@/lib/ambassador";

export async function POST(request: Request) {
  try {
    const { ambassadorEmail, rewardName } = await request.json();

    if (!ambassadorEmail || !rewardName) {
      return NextResponse.json(
        { error: "ambassadorEmail and rewardName are required" },
        { status: 400 },
      );
    }

    const result = await redeemReward(ambassadorEmail, rewardName);

    if (result.error) {
      const status = result.error === "Insufficient points" ? 402 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
