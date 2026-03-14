"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isAmbassadorLoggedIn,
  getAmbassadorUser,
  fetchAmbassadorStats,
  redeemAmbassadorReward,
} from "@/lib/ambassador-auth";

export default function AmbassadorRewardsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isAmbassadorLoggedIn()) {
      router.push("/ambassador/login");
      return;
    }

    const user = getAmbassadorUser();
    if (!user) {
      router.push("/ambassador/login");
      return;
    }

    fetchAmbassadorStats(user.email)
      .then((data) => {
        if (data.error) {
          router.push("/ambassador/login");
          return;
        }
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleRedeem = async (rewardName: string) => {
    const user = getAmbassadorUser();
    if (!user) return;

    setRedeeming(rewardName);
    setMessage(null);

    const result = await redeemAmbassadorReward(user.email, rewardName);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({
        type: "success",
        text: `"${rewardName}" redeemed! ${result.pointsDeducted} points deducted. A staff member will fulfill your reward.`,
      });
      // Refresh stats to get updated point balance
      const refreshed = await fetchAmbassadorStats(user.email);
      if (!refreshed.error) setStats(refreshed);
    }

    setRedeeming(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-pulse">🎁</div>
          <p className="text-sm text-gray-500">Loading rewards...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="p-6 text-center text-gray-500">Failed to load rewards</div>;
  }

  const currentPoints = stats.ambassador.totalPoints;
  const rewards = stats.rewards || [];
  const redemptions = stats.redemptions || [];

  return (
    <div className="max-w-xl mx-auto p-5 md:p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">Rewards</h1>
        <p className="text-sm text-gray-500">Redeem your hard-earned points for rewards</p>
      </div>

      {/* Points Balance */}
      <div className="bg-gradient-to-r from-[#1A5632] to-[#2a7a4a] rounded-xl p-5 mb-6 text-white">
        <p className="text-xs text-white/60 uppercase tracking-wide">Your Balance</p>
        <p className="text-4xl font-bold mt-1">{currentPoints.toLocaleString()}</p>
        <p className="text-xs text-white/60">points available</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-5 p-3 rounded-xl border text-sm ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Reward Cards */}
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-2">
        Available Rewards
      </p>
      <div className="space-y-3 mb-8">
        {rewards.map((reward: any) => {
          const canAfford = currentPoints >= reward.pointCost;
          return (
            <div
              key={reward.name}
              className={`bg-white rounded-xl border p-4 ${
                canAfford ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">{reward.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{reward.description}</p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className="text-sm font-bold text-[#C8A84E]">
                    {reward.pointCost.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400">points</p>
                </div>
              </div>
              <button
                onClick={() => handleRedeem(reward.name)}
                disabled={!canAfford || redeeming === reward.name}
                className={`mt-3 w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                  canAfford
                    ? "bg-[#1A5632] text-white hover:bg-[#154528]"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                {redeeming === reward.name
                  ? "Redeeming..."
                  : canAfford
                  ? "Redeem"
                  : `Need ${(reward.pointCost - currentPoints).toLocaleString()} more points`}
              </button>
            </div>
          );
        })}
      </div>

      {/* Redemption History */}
      {redemptions.length > 0 && (
        <>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-2">
            Redemption History
          </p>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {redemptions.map((r: any) => (
              <div key={r.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{r.rewardName}</p>
                  <p className="text-[10px] text-gray-500">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">-{r.pointsCost}pts</p>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.status === "fulfilled"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
