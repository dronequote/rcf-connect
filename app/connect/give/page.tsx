"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Section, Btn, Input, Card } from "@/components/ui";
import { GIVE_FUNDS, GIVE_METHODS } from "@/lib/constants";

export default function GivePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [fund, setFund] = useState("general");
  const [method, setMethod] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [frequency, setFrequency] = useState("monthly");
  const [step, setStep] = useState(1);

  // Thank you confirmation
  if (step === 3) {
    const fundLabel =
      GIVE_FUNDS.find((f) => f.id === fund)?.label || "General Fund";
    return (
      <div className="min-h-screen bg-gradient-to-b from-church-dark to-church-main flex items-center justify-center">
        <div className="text-center px-10 py-10 animate-fade-up">
          <div className="text-5xl mb-4">🙏</div>
          <h2 className="font-serif text-white text-[26px] font-normal mb-2">
            Thank You
          </h2>
          <p className="text-white/70 text-sm mb-1">
            Your gift of{" "}
            <strong className="text-gold">${amount || "—"}</strong> to{" "}
            <strong className="text-gold">{fundLabel}</strong>
          </p>
          <p className="text-white/50 text-[13px] mb-6">
            is making a difference at The River.
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
          title="Give Generously"
          subtitle="Every gift helps The River grow"
          onBack={step === 1 ? () => router.push("/") : () => setStep(1)}
          gold
        />

        {step === 1 && (
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

            <Btn onClick={() => setStep(2)} full disabled={!amount}>
              Continue →
            </Btn>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <Section label="HOW WOULD YOU LIKE TO GIVE?">
              <div className="flex flex-col gap-2.5">
                {GIVE_METHODS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMethod(m.id)}
                    className={`flex items-center gap-3.5 p-4 rounded-xl cursor-pointer text-left border-2 transition-all ${
                      method === m.id
                        ? "border-gold bg-gold-light"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        method === m.id ? "border-gold" : "border-gray-300"
                      }`}
                    >
                      {method === m.id && (
                        <div className="w-2.5 h-2.5 rounded-full bg-gold" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900">
                        {m.label}
                      </div>
                      <div className="text-xs text-gray-400">{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </Section>

            <Card className="mb-5 !bg-church-soft !border-church-main/20">
              <div className="text-xs text-gray-400 font-bold uppercase tracking-wide mb-1">
                Your Gift
              </div>
              <div className="text-xl font-bold text-church-main">
                ${amount}
              </div>
              <div className="text-xs text-gray-500">
                {GIVE_FUNDS.find((f) => f.id === fund)?.label}
                {recurring && ` · ${frequency}`}
              </div>
            </Card>

            <Btn
              onClick={() => setStep(3)}
              variant="gold"
              full
              disabled={!method}
            >
              Complete Gift
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
