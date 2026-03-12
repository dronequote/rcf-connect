"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Section, Card, Btn, Input, Tag } from "@/components/ui";
import { CHURCH } from "@/lib/constants";

const DONOR_PERFECT_URL = CHURCH.donorPerfect;

const volunteerRoles = ["Cooking", "Serving", "Setup", "Cleanup"];

export default function AgapePage() {
  const router = useRouter();
  const [view, setView] = useState<"main" | "volunteer" | "success">(
    "main"
  );
  const [volunteerForm, setVolunteerForm] = useState({
    first: "",
    last: "",
    email: "",
    roles: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const mealsServed = 890;
  const mealsGoal = 5000;
  const pct = Math.round((mealsServed / mealsGoal) * 100);

  const toggleRole = (role: string) =>
    setVolunteerForm((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));

  const handleVolunteerSubmit = async () => {
    if (!volunteerForm.first || !volunteerForm.email) return;
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: volunteerForm.first,
          lastName: volunteerForm.last,
          email: volunteerForm.email,
          interests: volunteerForm.roles,
          formTag: "Agape Volunteer",
          source: "Website",
        }),
      });
    } catch {
      // Continue to success
    }
    setView("success");
  };

  if (view === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-church-dark via-church-main to-church-light flex items-center justify-center">
        <div className="text-center px-7 py-10 animate-fade-up">
          <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white/80 inline-flex items-center justify-center text-[32px] mb-5 animate-checkmark">
            ✓
          </div>
          <h2 className="font-serif text-white text-[28px] font-normal mb-2.5">
            Thank You!
          </h2>
          <p className="text-white/75 text-sm mb-7 leading-relaxed">
            Your generosity is making a real difference in our community.
          </p>
          <Btn onClick={() => router.push("/")} variant="white">
            Back to Home
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm">
      <div className="max-w-[460px] mx-auto p-5">
        <Header
          title="Agape Meals"
          subtitle="Feeding our community with love"
          onBack={
            view === "main"
              ? () => router.push("/")
              : () => setView("main")
          }
        />

        {view === "main" && (
          <div className="animate-fade-up">
            <Card className="mb-4">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Every week, The River opens its doors to serve free meals to
                anyone in our community. No questions asked, no strings
                attached — just love on a plate.
              </p>
              <div className="text-[11px] font-bold text-gold tracking-[1.5px] mb-2 uppercase">
                MEALS SERVED IN 2026
              </div>
              <div className="text-3xl font-bold text-church-main mb-1">
                {mealsServed.toLocaleString()}
              </div>
              <div className="text-xs text-gray-400 mb-2">
                Goal: {mealsGoal.toLocaleString()} meals
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-church-main to-church-light rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Card>

            <Section label="SUPPORT AGAPE MEALS">
              <Card className="mb-3">
                <p className="text-xs text-gray-500 leading-relaxed">
                  Your donation feeds families in Twin Falls — every dollar goes
                  directly to meals and groceries for those in need.
                </p>
              </Card>
              <a
                href={DONOR_PERFECT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-4 rounded-xl text-base font-semibold text-center cursor-pointer bg-gradient-to-br from-gold to-[#d4b85e] text-church-dark shadow-[0_4px_14px_rgba(200,168,78,0.19)] no-underline mb-4"
              >
                Donate via DonorPerfect →
              </a>
            </Section>

            <Section label="VOLUNTEER">
              <Card
                className="cursor-pointer hover:border-church-main transition-all"
                onClick={() => setView("volunteer")}
              >
                <div className="font-semibold text-sm text-gray-900 mb-1">
                  Join the Agape Team
                </div>
                <div className="text-xs text-gray-500">
                  We need help with cooking, serving, setup, and cleanup. Sign
                  up and we&apos;ll connect you with the team.
                </div>
                <div className="text-church-main text-xs font-semibold mt-2">
                  Sign up →
                </div>
              </Card>
            </Section>

            <Section label="FOOD PANTRY">
              <Card>
                <div className="font-semibold text-sm text-gray-900 mb-1">
                  Food Pantry Needs
                </div>
                <div className="text-xs text-gray-500">
                  Check the Connection Table at church for the current needs
                  list. Donations can be dropped off during office hours
                  (Mon-Fri, 9 AM - 5 PM).
                </div>
              </Card>
            </Section>
          </div>
        )}

        {view === "volunteer" && (
          <div className="animate-fade-up">
            <div className="flex gap-2.5 mb-3.5">
              <Input
                label="First Name"
                value={volunteerForm.first}
                onChange={(v) =>
                  setVolunteerForm((p) => ({ ...p, first: v }))
                }
              />
              <Input
                label="Last Name"
                value={volunteerForm.last}
                onChange={(v) =>
                  setVolunteerForm((p) => ({ ...p, last: v }))
                }
              />
            </div>
            <Input
              label="Email"
              value={volunteerForm.email}
              onChange={(v) =>
                setVolunteerForm((p) => ({ ...p, email: v }))
              }
              type="email"
            />

            <Section label="I CAN HELP WITH">
              <div className="flex flex-wrap gap-2">
                {volunteerRoles.map((role) => (
                  <Tag
                    key={role}
                    active={volunteerForm.roles.includes(role)}
                    onClick={() => toggleRole(role)}
                  >
                    {role}
                  </Tag>
                ))}
              </div>
            </Section>

            <Btn
              onClick={handleVolunteerSubmit}
              full
              disabled={
                submitting || !volunteerForm.first || !volunteerForm.email
              }
            >
              {submitting ? "Signing Up..." : "Sign Up to Volunteer"}
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
