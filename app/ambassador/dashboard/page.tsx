"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAmbassadorUser,
  isAmbassadorLoggedIn,
  fetchAmbassadorStats,
  ambassadorLogout,
} from "@/lib/ambassador-auth";

export default function AmbassadorDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
          ambassadorLogout();
          router.push("/ambassador/login");
          return;
        }
        setStats(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [router]);

  const handleCopyLink = () => {
    if (!stats?.referralLink) return;
    const fullLink = `${window.location.origin}${stats.referralLink}`;
    navigator.clipboard.writeText(fullLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    ambassadorLogout();
    router.push("/ambassador/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-2 animate-pulse">📊</div>
          <p className="text-sm text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Failed to load dashboard</p>
      </div>
    );
  }

  const { ambassador, stats: s, recentConversions, recentClicks, referralLink } = stats;

  return (
    <div className="max-w-3xl mx-auto p-5 md:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl text-gray-900">
            Hey, {ambassador.firstName}!
          </h1>
          <p className="text-sm text-gray-500">Your ambassador dashboard</p>
        </div>
        <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-gray-600">
          Log out
        </button>
      </div>

      {/* Share Link */}
      <div className="bg-[#1A5632] rounded-xl p-5 mb-6 text-white">
        <p className="text-xs font-bold uppercase tracking-wide text-white/60 mb-2">
          Your Referral Link
        </p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/10 rounded-lg px-3 py-2 text-sm font-mono truncate">
            {typeof window !== "undefined" ? window.location.origin : ""}{referralLink}
          </div>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-[#C8A84E] rounded-lg text-xs font-bold shrink-0"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <p className="text-[10px] text-white/50 mt-2">
          Share this link with friends. When they visit, sign up, or attend — you earn points!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Points", value: s.totalPoints.toLocaleString(), color: "text-[#C8A84E]" },
          { label: "Total Referrals", value: s.totalReferrals, color: "text-[#1A5632]" },
          { label: "Total Clicks", value: s.totalClicks, color: "text-blue-600" },
          { label: "Conversion Rate", value: `${s.conversionRate}%`, color: "text-purple-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-100">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-[10px] text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* This Month */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-green-50 rounded-xl p-4 border border-green-100">
          <p className="text-xl font-bold text-green-700">{s.thisMonthReferrals}</p>
          <p className="text-[10px] text-green-600">Referrals This Month</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <p className="text-xl font-bold text-blue-700">{s.recentClicks}</p>
          <p className="text-[10px] text-blue-600">Clicks (Last 30 Days)</p>
        </div>
      </div>

      {/* Recent Conversions */}
      {recentConversions.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-2">
            Recent Conversions
          </p>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {recentConversions.slice(0, 5).map((c: any) => (
              <div key={c.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{c.visitorName}</p>
                  <p className="text-[10px] text-gray-500">
                    {c.items.map((i: any) => i.productName).join(", ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-[#C8A84E]">+{c.totalPointsAwarded}pts</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Clicks */}
      {recentClicks.length > 0 && (
        <div className="mb-6">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-2">
            Recent Clicks
          </p>
          <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-100">
            {recentClicks.slice(0, 5).map((c: any) => (
              <div key={c.id} className="px-4 py-2.5 flex items-center justify-between">
                <p className="text-xs text-gray-600 truncate flex-1">{c.path}</p>
                <p className="text-[10px] text-gray-400 shrink-0 ml-3">
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="/ambassador/rewards"
          className="bg-[#C8A84E] rounded-xl p-4 text-center text-white"
        >
          <p className="text-2xl mb-1">🎁</p>
          <p className="text-xs font-bold">Redeem Rewards</p>
        </a>
        <a
          href="/ambassador/leaderboard"
          className="bg-[#1A5632] rounded-xl p-4 text-center text-white"
        >
          <p className="text-2xl mb-1">🏆</p>
          <p className="text-xs font-bold">Leaderboard</p>
        </a>
      </div>
    </div>
  );
}
