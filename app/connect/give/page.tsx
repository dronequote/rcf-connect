"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Section, Btn, Input, Card } from "@/components/ui";
import { GIVE_FUNDS, CHURCH } from "@/lib/constants";

const DONOR_PERFECT_URL = CHURCH.donorPerfect;

export default function GivePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [fund, setFund] = useState("general");
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");

  return (
    <div className="min-h-screen bg-warm">
      <div className="max-w-[460px] mx-auto p-5">
        <Header
          title="Give Generously"
          subtitle="Every gift helps The River grow"
          onBack={() => router.push("/")}
          gold
        />

        <div className="animate-fade-up">
          <Section label="AMOUNT">
            <div className="grid grid-cols-3 gap-2.5 mb-3">
              {["10", "25", "50"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAmount(a)}
                  className={`py-[18px] rounded-[14px] cursor-pointer text-[22px] font-bold text-church-main border-2 transition-all ${
                    amount === a
                      ? "border-gold bg-gold-light"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  ${a}
                </button>
              ))}
            </div>
            <Input
              placeholder="Other amount"
              value={amount}
              onChange={setAmount}
            />
          </Section>

          <Section label="FUND">
            <div className="flex flex-col gap-2">
              {GIVE_FUNDS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFund(f.id)}
                  className={`flex items-center gap-3.5 p-3.5 rounded-xl cursor-pointer text-left border-2 transition-all ${
                    fund === f.id
                      ? "border-church-main bg-church-soft"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      fund === f.id ? "border-church-main" : "border-gray-300"
                    }`}
                  >
                    {fund === f.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-church-main" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">
                      {f.label}
                    </div>
                    <div className="text-xs text-gray-400">{f.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          {/* Recurring giving toggle */}
          <Section label="RECURRING GIFT">
            <div className="flex items-center gap-2.5 mb-3">
              <button
                onClick={() => setRecurring(!recurring)}
                className={`w-10 h-[22px] rounded-[11px] cursor-pointer relative transition-colors ${
                  recurring ? "bg-church-main" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white absolute top-[3px] transition-all shadow-sm ${
                    recurring ? "left-[21px]" : "left-[3px]"
                  }`}
                />
              </button>
              <span className="text-[13px] text-gray-900">
                Make this a recurring gift
              </span>
            </div>
            {recurring && (
              <div className="flex gap-2">
                {["Weekly", "Bi-weekly", "Monthly"].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setFrequency(freq.toLowerCase())}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                      frequency === freq.toLowerCase()
                        ? "border-church-main bg-church-soft text-church-main"
                        : "border-gray-200 bg-white text-gray-500"
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            )}
          </Section>

          {/* Primary CTA — opens DonorPerfect */}
          <a
            href={DONOR_PERFECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-3.5 rounded-xl text-sm font-semibold text-center cursor-pointer bg-gradient-to-br from-gold to-[#d4b85e] text-church-dark shadow-[0_4px_14px_rgba(200,168,78,0.19)] no-underline mb-4"
          >
            Give Online via DonorPerfect →
          </a>

          {/* Alternative methods */}
          <Section label="OTHER WAYS TO GIVE">
            <div className="flex flex-col gap-2.5">
              <Card className="!p-4">
                <div className="font-semibold text-sm text-gray-900">
                  Venmo
                </div>
                <div className="text-xs text-gray-500">
                  Send to{" "}
                  <span className="font-semibold text-church-main">
                    @TheRiverCF
                  </span>
                </div>
              </Card>
              <Card className="!p-4">
                <div className="font-semibold text-sm text-gray-900">
                  Text to Give
                </div>
                <div className="text-xs text-gray-500">
                  Text{" "}
                  <span className="font-semibold text-church-main">
                    &quot;give&quot;
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-church-main">
                    208-844-4328
                  </span>
                </div>
              </Card>
              <Card className="!p-4">
                <div className="font-semibold text-sm text-gray-900">
                  In Person
                </div>
                <div className="text-xs text-gray-500">
                  Cash or check via giving envelope on Sunday
                </div>
              </Card>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
