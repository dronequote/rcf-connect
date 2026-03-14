"use client";

import { useState, useEffect } from "react";
import { Card, Section } from "@/components/ui";
import StaffHelp from "@/components/StaffHelp";
import { fetchWithStaffAuth } from "@/lib/staff-auth";

interface AmbassadorRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  slug: string;
  status: string;
  totalPoints: number;
  totalReferrals: number;
  totalClicks: number;
  joinedAt: string;
  riskScore: number;
}

interface DashboardStats {
  ambassadors: { total: number; active: number };
  clicks: { total: number; thisMonth: number };
  conversions: { total: number; thisMonth: number };
  totalPointsAwarded: number;
  pendingRedemptions: number;
  conversionRate: string;
}

interface Redemption {
  _id: string;
  ambassadorEmail: string;
  ambassadorName: string;
  rewardName: string;
  pointsCost: number;
  status: string;
  createdAt: string;
}

export default function AmbassadorsAdminClient() {
  const [ambassadors, setAmbassadors] = useState<AmbassadorRow[]>([]);
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "ambassadors" | "redemptions">("overview");

  useEffect(() => {
    Promise.all([
      fetchWithStaffAuth("/api/ambassador/admin/dashboard").then((r) => r.json()),
      fetchWithStaffAuth("/api/ambassador/admin/ambassadors").then((r) => r.json()),
      fetchWithStaffAuth("/api/ambassador/admin/redemptions").then((r) => r.json()),
    ])
      .then(([dash, ambs, reds]) => {
        setDashboard(dash);
        setAmbassadors(Array.isArray(ambs) ? ambs : []);
        setRedemptions(Array.isArray(reds) ? reds : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const res = await fetchWithStaffAuth(`/api/ambassador/admin/ambassadors/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setAmbassadors((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)),
      );
    }
  };

  const handleFulfill = async (redemptionId: string) => {
    const res = await fetchWithStaffAuth(
      `/api/ambassador/admin/redemptions/${redemptionId}/fulfill`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNote: "Fulfilled by staff" }),
      },
    );
    if (res.ok) {
      setRedemptions((prev) =>
        prev.map((r) => (r._id === redemptionId ? { ...r, status: "fulfilled" } : r)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetchWithStaffAuth(`/api/ambassador/admin/ambassadors/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setAmbassadors((prev) => prev.filter((a) => a.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="p-5 md:p-8 max-w-4xl">
        <h1 className="font-serif text-2xl text-gray-900 mb-2">Ambassador Program</h1>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">Ambassador Program</h1>
        <p className="text-sm text-gray-500">Manage ambassadors, track referrals, and fulfill rewards</p>
      </div>

      <StaffHelp section="ambassador" />

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-gray-100 rounded-xl p-1">
        {(["overview", "ambassadors", "redemptions"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors capitalize ${
              tab === t ? "bg-white text-church-main shadow" : "text-gray-500"
            }`}
          >
            {t}
            {t === "redemptions" && dashboard && dashboard.pendingRedemptions > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px]">
                {dashboard.pendingRedemptions}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === "overview" && dashboard && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {[
              { label: "Total Ambassadors", value: dashboard.ambassadors.total, sub: `${dashboard.ambassadors.active} active` },
              { label: "Total Clicks", value: dashboard.clicks.total, sub: `${dashboard.clicks.thisMonth} this month` },
              { label: "Conversions", value: dashboard.conversions.total, sub: `${dashboard.conversions.thisMonth} this month` },
              { label: "Points Awarded", value: dashboard.totalPointsAwarded.toLocaleString(), sub: "all time" },
              { label: "Conversion Rate", value: `${dashboard.conversionRate}%`, sub: "clicks → conversions" },
              { label: "Pending Rewards", value: dashboard.pendingRedemptions, sub: "awaiting fulfillment" },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-church-main">{stat.value}</p>
                <p className="text-[10px] text-gray-500 font-semibold">{stat.label}</p>
                <p className="text-[9px] text-gray-400">{stat.sub}</p>
              </Card>
            ))}
          </div>

          <Section label="AMBASSADOR PORTAL LINK">
            <Card>
              <p className="text-xs text-gray-500 mb-2">
                Share this link with potential ambassadors to sign up:
              </p>
              <div className="bg-gray-50 rounded-lg px-3 py-2 text-sm font-mono text-church-main">
                {typeof window !== "undefined" ? window.location.origin : ""}/ambassador
              </div>
            </Card>
          </Section>
        </>
      )}

      {/* Ambassadors Tab */}
      {tab === "ambassadors" && (
        <Section label={`ALL AMBASSADORS (${ambassadors.length})`}>
          <div className="space-y-2">
            {ambassadors.length === 0 ? (
              <Card className="text-center py-6">
                <p className="text-gray-400 text-sm">No ambassadors yet</p>
              </Card>
            ) : (
              ambassadors.map((a) => (
                <Card key={a.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {a.firstName} {a.lastName}
                      </p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          a.status === "active"
                            ? "bg-green-100 text-green-700"
                            : a.status === "suspended"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {a.status}
                      </span>
                      {a.riskScore > 20 && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700">
                          Risk: {a.riskScore}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{a.email}</p>
                    <p className="text-[10px] text-gray-400">
                      /ref/{a.slug} · {a.totalPoints}pts · {a.totalReferrals} referrals · {a.totalClicks} clicks
                    </p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {a.status !== "active" && (
                      <button
                        onClick={() => handleStatusChange(a.id, "active")}
                        className="px-2 py-1 text-[10px] font-bold rounded bg-green-100 text-green-700"
                      >
                        Activate
                      </button>
                    )}
                    {a.status === "active" && (
                      <button
                        onClick={() => handleStatusChange(a.id, "suspended")}
                        className="px-2 py-1 text-[10px] font-bold rounded bg-yellow-100 text-yellow-700"
                      >
                        Suspend
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="px-2 py-1 text-[10px] font-bold rounded bg-red-100 text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </Section>
      )}

      {/* Redemptions Tab */}
      {tab === "redemptions" && (
        <Section label={`REWARD REDEMPTIONS (${redemptions.length})`}>
          <div className="space-y-2">
            {redemptions.length === 0 ? (
              <Card className="text-center py-6">
                <p className="text-gray-400 text-sm">No redemptions yet</p>
              </Card>
            ) : (
              redemptions.map((r) => (
                <Card key={r._id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900">{r.rewardName}</p>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          r.status === "fulfilled"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">
                      {r.ambassadorName} ({r.ambassadorEmail}) · {r.pointsCost}pts
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {r.status === "pending" && (
                    <button
                      onClick={() => handleFulfill(r._id)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-church-main text-white shrink-0"
                    >
                      Fulfill
                    </button>
                  )}
                </Card>
              ))
            )}
          </div>
        </Section>
      )}
    </div>
  );
}
