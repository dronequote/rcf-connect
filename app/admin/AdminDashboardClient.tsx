"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Section } from "@/components/ui";
import StaffHelp from "@/components/StaffHelp";
import { getStaffUser } from "@/lib/staff-auth";
import type { DashboardStats, Visitor } from "@/lib/types";

interface AdminDashboardProps {
  stats: DashboardStats;
  visitors: Visitor[];
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  following_up: "bg-yellow-100 text-yellow-700",
  connected: "bg-green-100 text-green-700",
  regular: "bg-purple-100 text-purple-700",
};

const statusLabels: Record<string, string> = {
  new: "New",
  following_up: "Following Up",
  connected: "Connected",
  regular: "Regular",
};

export default function AdminDashboardClient({ stats, visitors }: AdminDashboardProps) {
  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const staffUser = getStaffUser();
    if (staffUser) {
      setGreeting(`Welcome, ${staffUser.firstName}`);
    } else {
      // Legacy fallback
      const stored = localStorage.getItem("rcf_user");
      if (stored) {
        const user = JSON.parse(stored);
        setGreeting(`Welcome, ${user.name?.split(" ")[0] || ""}`);
      }
    }
  }, []);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="p-5 md:p-8 max-w-4xl">
      {/* Greeting */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-gray-900">{greeting}</h1>
        <p className="text-sm text-gray-500">{today}</p>
      </div>

      <StaffHelp section="dashboard" />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "New Visitors", value: stats.newVisitorsThisWeek, sub: "This week", color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Agape Donations", value: `$${stats.agapeDonationsThisMonth.toLocaleString()}`, sub: "This month", color: "text-green-600", bg: "bg-green-50" },
          { label: "QR Scans", value: stats.qrScansThisSunday, sub: "This Sunday", color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Active Members", value: stats.activeMembers, sub: "Total", color: "text-church-main", bg: "bg-church-soft" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-4`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Visitors */}
      <Section label="RECENT VISITORS">
        <div className="space-y-2 mb-6">
          {visitors.slice(0, 4).map((v) => (
            <Card key={v.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-church-soft flex items-center justify-center text-church-main text-xs font-bold shrink-0">
                {v.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-900 truncate">{v.name}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusColors[v.status]}`}>
                    {statusLabels[v.status]}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate">{v.interests.join(", ")}</p>
              </div>
              <p className="text-[10px] text-gray-400 shrink-0">{v.date}</p>
            </Card>
          ))}
        </div>
        <Link
          href="/admin/visitors"
          className="text-sm text-church-main font-semibold no-underline"
        >
          View All Visitors →
        </Link>
      </Section>

      {/* Social Engagement */}
      <Section label="SOCIAL ENGAGEMENT">
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <p className="text-2xl font-bold text-[#1877F2]">{stats.fbCheckinsToday}</p>
            <p className="text-xs text-gray-500">FB Check-ins Today</p>
          </Card>
          <Card className="text-center">
            <p className="text-2xl font-bold text-[#1877F2]">{stats.fbPageLikes}</p>
            <p className="text-xs text-gray-500">Page Likes</p>
          </Card>
        </div>
      </Section>

      {/* Quick Links */}
      <Section label="QUICK ACTIONS">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {[
            { href: "/admin/bulletin", icon: "📰", label: "Edit Bulletin" },
            { href: "/admin/ai", icon: "🤖", label: "AI Sermon Tools" },
            { href: "/admin/agape", icon: "🍽️", label: "Agape Meals" },
            { href: "/admin/social", icon: "📱", label: "Social Media" },
            { href: "/admin/visitors", icon: "👥", label: "All Visitors" },
            { href: "/member", icon: "👤", label: "Member View" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-200 no-underline hover:border-church-main transition-colors"
            >
              <span className="text-lg">{a.icon}</span>
              <span className="text-xs font-semibold text-gray-700">{a.label}</span>
            </Link>
          ))}
        </div>
      </Section>
    </div>
  );
}
