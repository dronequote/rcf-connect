"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Section, Card, Btn, Input, Tag } from "@/components/ui";

const donationTiers = [
  { amount: "10", label: "Feeds 2 people" },
  { amount: "25", label: "Feeds a family" },
  { amount: "50", label: "Feeds a table" },
];

const volunteerRoles = ["Cooking", "Serving", "Setup", "Cleanup"];

export default function AgapePage() {
  const router = useRouter();
  const [view, setView] = useState<"main" | "donate" | "volunteer" | "success">(
    "main"
  );
  const [donateAmount, setDonateAmount] = useState("");
  const [volunteerForm, setVolunteerForm] = useState({
    first: "",
    last: "",
    email: "",
    roles: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const mealsServed = 1247;
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
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                {donationTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => {
                      setDonateAmount(tier.amount);
                      setView("donate");
                    }}
                    className="p-4 rounded-xl border-2 border-gray-200 bg-white text-center cursor-pointer hover:border-gold hover:bg-gold-light transition-all"
                  >
                    <div className="text-xl font-bold text-church-main">
                      ${tier.amount}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {tier.label}
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setView("donate")}
                className="w-full p-3 rounded-xl border-2 border-dashed border-gray-200 bg-white text-sm text-gray-500 cursor-pointer hover:border-gold transition-all"
              >
                Other Amount
              </button>
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

        {view === "donate" && (
          <div className="animate-fade-up">
            <Section label="DONATION AMOUNT">
              <div className="grid grid-cols-3 gap-2.5 mb-3">
                {donationTiers.map((tier) => (
                  <button
                    key={tier.amount}
                    onClick={() => setDonateAmount(tier.amount)}
                    className={`py-[18px] rounded-[14px] cursor-pointer text-[22px] font-bold text-church-main border-2 transition-all ${
                      donateAmount === tier.amount
                        ? "border-gold bg-gold-light"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    ${tier.amount}
                  </button>
                ))}
              </div>
              <Input
                placeholder="Other amount"
                value={donateAmount}
                onChange={setDonateAmount}
              />
            </Section>

            <Card className="mb-4 !bg-church-soft !border-church-main/20">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                Your Gift to Agape Meals
              </div>
              <div className="text-xl font-bold text-church-main">
                ${donateAmount || "—"}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                100% goes to feeding our community
              </div>
            </Card>

            <Btn
              onClick={() => setView("success")}
              full
              disabled={!donateAmount}
            >
              Give to Agape Meals
            </Btn>
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
