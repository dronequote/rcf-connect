"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, Section } from "@/components/ui";
import type { Member } from "@/lib/types";

interface ProfileClientProps {
  member: Member;
}

export default function ProfileClient({ member }: ProfileClientProps) {
  const [notifications, setNotifications] = useState(member.notifications);

  const toggleNotif = (key: keyof typeof notifications) =>
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="max-w-[460px] mx-auto p-5">
      <div className="bg-gradient-to-br from-church-main to-church-light -mx-5 -mt-5 px-5 pt-5 pb-7 rounded-b-3xl mb-6">
        <h1 className="font-serif text-white text-2xl mb-1">Profile</h1>
      </div>

      {/* Avatar & Info */}
      <div className="text-center -mt-12 mb-6">
        <div className="inline-flex w-20 h-20 rounded-full bg-church-main border-4 border-white items-center justify-center text-white text-2xl font-bold shadow-lg">
          {member.avatar}
        </div>
        <h2 className="font-serif text-xl text-gray-900 mt-3">
          {member.firstName} {member.lastName}
        </h2>
        <p className="text-xs text-gray-500">{member.email}</p>
        <p className="text-xs text-gray-500">{member.phone}</p>
      </div>

      {/* Family */}
      <Section label="MY FAMILY">
        <Card className="mb-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">{member.family.name}</p>
          {member.family.members.map((m) => (
            <div key={m.name} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-500">
                  {"age" in m ? `Age ${m.age} · ${m.grade}` : m.role}
                </p>
              </div>
              {"ministry" in m && (
                <span className="px-2 py-0.5 rounded-full bg-church-soft text-church-main text-[10px] font-semibold">
                  {m.ministry}
                </span>
              )}
            </div>
          ))}
        </Card>
      </Section>

      {/* Groups */}
      <Section label="MY GROUPS">
        <div className="space-y-2 mb-4">
          {member.groups.map((g) => (
            <div key={g} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200">
              <div className="w-8 h-8 rounded-lg bg-church-soft flex items-center justify-center text-sm">
                👥
              </div>
              <p className="text-sm font-medium text-gray-900">{g}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Notifications */}
      <Section label="NOTIFICATIONS">
        <Card className="mb-4">
          {(
            [
              { key: "email" as const, label: "Email Notifications", desc: "Weekly updates & announcements" },
              { key: "sms" as const, label: "SMS Reminders", desc: "Event reminders & urgent prayer" },
              { key: "prayerDigest" as const, label: "Weekly Prayer Digest", desc: "Community prayer requests" },
            ] as const
          ).map((n) => (
            <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-semibold text-gray-900">{n.label}</p>
                <p className="text-xs text-gray-500">{n.desc}</p>
              </div>
              <button
                onClick={() => toggleNotif(n.key)}
                className={`w-12 h-7 rounded-full transition-colors relative ${
                  notifications[n.key] ? "bg-church-main" : "bg-gray-300"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    notifications[n.key] ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </Card>
      </Section>

      {/* Sign Out */}
      <Link
        href="/login"
        className="block w-full py-3 rounded-xl bg-gray-100 text-gray-600 text-sm font-semibold text-center no-underline mt-4"
      >
        Sign Out
      </Link>
    </div>
  );
}
