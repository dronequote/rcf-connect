"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAmbassadorLoggedIn, fetchLeaderboard, getAmbassadorUser } from "@/lib/ambassador-auth";

const periods = [
  { value: "monthly", label: "This Month" },
  { value: "quarterly", label: "This Quarter" },
  { value: "yearly", label: "This Year" },
  { value: "alltime", label: "All Time" },
];

export default function AmbassadorLeaderboardPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAmbassadorLoggedIn()) {
      router.push("/ambassador/login");
      return;
    }

    fetchLeaderboard(period)
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [period, router]);

  const currentUser = getAmbassadorUser();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-pulse">🏆</div>
          <p className="text-sm text-gray-500">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-5 md:p-8">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">Leaderboard</h1>
        <p className="text-sm text-gray-500">See how you rank among fellow ambassadors</p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1">
        {periods.map((p) => (
          <button
            key={p.value}
            onClick={() => { setPeriod(p.value); setLoading(true); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              period === p.value
                ? "bg-white text-[#1A5632] shadow"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      {!data?.enabled ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">🏆</p>
          <p className="text-sm">Leaderboard is not enabled</p>
        </div>
      ) : data.entries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-4xl mb-2">📊</p>
          <p className="text-sm">No data for this period yet</p>
          <p className="text-xs text-gray-400 mt-1">Start sharing your link to climb the ranks!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {data.entries.map((entry: any) => {
            const isMe = currentUser &&
              entry.firstName === currentUser.firstName &&
              entry.lastName.startsWith(currentUser.lastName[0]);

            return (
              <div
                key={entry.rank}
                className={`flex items-center gap-3 p-4 rounded-xl border ${
                  isMe
                    ? "border-[#C8A84E] bg-[#C8A84E]/5"
                    : "border-gray-100 bg-white"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    entry.rank === 1
                      ? "bg-yellow-100 text-yellow-700"
                      : entry.rank === 2
                      ? "bg-gray-200 text-gray-600"
                      : entry.rank === 3
                      ? "bg-orange-100 text-orange-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {entry.rank <= 3
                    ? ["🥇", "🥈", "🥉"][entry.rank - 1]
                    : entry.rank}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {entry.firstName} {entry.lastName}
                    {isMe && <span className="text-[10px] text-[#C8A84E] ml-1">(You)</span>}
                  </p>
                  <p className="text-[10px] text-gray-500">
                    {entry.referralCount} referral{entry.referralCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#C8A84E]">
                    {entry.totalPoints.toLocaleString()}
                  </p>
                  <p className="text-[10px] text-gray-400">points</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
