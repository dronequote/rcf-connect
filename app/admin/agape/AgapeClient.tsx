"use client";

import { useState, useEffect } from "react";
import { Card, Section } from "@/components/ui";
import StaffHelp from "@/components/StaffHelp";
import { fetchWithStaffAuth } from "@/lib/staff-auth";
import type { DashboardStats } from "@/lib/types";

interface AgapeClientProps {
  stats: DashboardStats;
}

interface AgapeCheckin {
  id?: string;
  family: string;
  count: number;
  time: string;
  date?: string;
}

const monthlyData = [
  { month: "Jan", meals: 145, donations: 980 },
  { month: "Feb", meals: 162, donations: 1120 },
  { month: "Mar", meals: 178, donations: 1350 },
];

const volunteers = [
  { name: "Linda Torres", roles: ["Cooking", "Setup"], date: "Jan 15" },
  { name: "Mark Davis", roles: ["Serving"], date: "Feb 3" },
  { name: "Amy Chen", roles: ["Cooking", "Cleanup"], date: "Feb 10" },
  { name: "Robert Kim", roles: ["Setup", "Serving"], date: "Mar 1" },
];

export default function AgapeClient({ stats }: AgapeClientProps) {
  const [mealsServed, setMealsServed] = useState(stats.mealsServed);
  const [mealsGoal] = useState(stats.mealsGoal);
  const [checkinFamily, setCheckinFamily] = useState("");
  const [checkinCount, setCheckinCount] = useState("");
  const [recentCheckins, setRecentCheckins] = useState<AgapeCheckin[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWithStaffAuth("/api/admin/agape/checkins")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRecentCheckins(data.slice(0, 10));
        } else {
          setRecentCheckins([
            { family: "Rivera Family", count: 4, time: "5:35 PM" },
            { family: "Thompson Family", count: 2, time: "5:42 PM" },
            { family: "Walk-in Guest", count: 1, time: "5:50 PM" },
          ]);
        }
      })
      .catch(() => {
        setRecentCheckins([
          { family: "Rivera Family", count: 4, time: "5:35 PM" },
          { family: "Thompson Family", count: 2, time: "5:42 PM" },
          { family: "Walk-in Guest", count: 1, time: "5:50 PM" },
        ]);
      });
  }, []);

  const pct = Math.round((mealsServed / mealsGoal) * 100);

  const handleCheckin = async () => {
    if (!checkinFamily.trim() || !checkinCount) return;
    const count = parseInt(checkinCount);
    if (isNaN(count) || count < 1) return;

    setSaving(true);
    try {
      const res = await fetchWithStaffAuth("/api/admin/agape/checkins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ family: checkinFamily, count }),
      });

      if (res.ok) {
        const data = await res.json();
        setRecentCheckins((prev) => [data.checkin, ...prev]);
        setMealsServed((prev) => prev + count);
        setCheckinFamily("");
        setCheckinCount("");
      }
    } catch (err) {
      console.error("Failed to check in:", err);
      setRecentCheckins((prev) => [
        { family: checkinFamily, count, time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }) },
        ...prev,
      ]);
      setMealsServed((prev) => prev + count);
      setCheckinFamily("");
      setCheckinCount("");
    }
    setSaving(false);
  };

  return (
    <div className="p-5 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">Agape Meals</h1>
        <p className="text-sm text-gray-500">Manage meals, donations &amp; volunteers</p>
      </div>

      <StaffHelp section="agape" />

      {/* Meals Counter */}
      <Card className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Meals Served in 2026</p>
            <p className="text-3xl font-bold text-church-main">{mealsServed.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Goal</p>
            <p className="text-lg font-bold text-gray-400">{mealsGoal.toLocaleString()}</p>
          </div>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-church-main to-church-light rounded-full transition-all duration-700"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 text-right mt-1">{pct}%</p>
      </Card>

      {/* Family Check-in */}
      <Section label="FAMILY CHECK-IN">
        <Card className="mb-5">
          <p className="text-xs text-gray-500 mb-3">Log arriving families for headcount</p>
          <div className="flex gap-2 mb-3">
            <input
              placeholder="Family name"
              value={checkinFamily}
              onChange={(e) => setCheckinFamily(e.target.value)}
              className="flex-1 px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-church-main"
            />
            <input
              type="number"
              placeholder="# People"
              value={checkinCount}
              onChange={(e) => setCheckinCount(e.target.value)}
              className="w-24 px-3 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-church-main"
            />
            <button
              onClick={handleCheckin}
              disabled={saving || !checkinFamily.trim() || !checkinCount}
              className="px-4 py-2.5 rounded-lg bg-church-main text-white text-xs font-semibold disabled:opacity-50"
            >
              {saving ? "..." : "Check In"}
            </button>
          </div>
          {recentCheckins.length > 0 && (
            <div className="border-t border-gray-100 pt-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Recent</p>
              {recentCheckins.map((c, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 text-xs">
                  <span className="text-gray-700">{c.family}</span>
                  <span className="text-gray-500">{c.count} people · {c.time}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </Section>

      {/* Monthly Breakdown */}
      <Section label="MONTHLY BREAKDOWN">
        <div className="grid grid-cols-3 gap-2 mb-5">
          {monthlyData.map((m) => (
            <Card key={m.month} className="text-center">
              <p className="text-xs text-gray-400 font-bold">{m.month}</p>
              <p className="text-lg font-bold text-church-main">{m.meals}</p>
              <p className="text-[10px] text-gray-500">meals</p>
              <p className="text-sm font-semibold text-green-600 mt-1">${m.donations}</p>
              <p className="text-[10px] text-gray-400">donated</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Volunteers */}
      <Section label="VOLUNTEERS">
        <Card>
          {volunteers.map((v, i) => (
            <div key={i} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-900">{v.name}</p>
                <div className="flex gap-1 mt-0.5">
                  {v.roles.map((r) => (
                    <span key={r} className="px-2 py-0.5 rounded-full bg-church-soft text-church-main text-[10px] font-semibold">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-gray-400">Signed up {v.date}</p>
            </div>
          ))}
        </Card>
      </Section>
    </div>
  );
}
