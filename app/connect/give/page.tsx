"use client";

import { useRouter } from "next/navigation";
import { Header, Section, Card } from "@/components/ui";
import { CHURCH } from "@/lib/constants";

const DONOR_PERFECT_URL = CHURCH.donorPerfect;

export default function GivePage() {
  const router = useRouter();

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
          <Card className="mb-5">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Your generosity fuels everything we do — from Sunday worship to
              feeding our neighbors through Agape Meals. Whether it&apos;s a
              one-time gift or recurring support, every dollar makes an impact.
            </p>
            <div className="text-[11px] font-bold text-gold tracking-[1.5px] mb-3 uppercase">
              WHERE YOUR GIFT GOES
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-church-main mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-sm text-gray-900">General Fund</span>
                  <span className="text-xs text-gray-500"> — Supports all ministries</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-church-main mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-sm text-gray-900">Agape Meals</span>
                  <span className="text-xs text-gray-500"> — Feed our community</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-church-main mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-sm text-gray-900">Food Pantry</span>
                  <span className="text-xs text-gray-500"> — Stock the shelves</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-church-main mt-1.5 shrink-0" />
                <div>
                  <span className="font-semibold text-sm text-gray-900">Missions</span>
                  <span className="text-xs text-gray-500"> — Reach beyond Twin Falls</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Primary CTA — opens DonorPerfect */}
          <a
            href={DONOR_PERFECT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-6 py-4 rounded-xl text-base font-semibold text-center cursor-pointer bg-gradient-to-br from-gold to-[#d4b85e] text-church-dark shadow-[0_4px_14px_rgba(200,168,78,0.19)] no-underline mb-5"
          >
            Donate via DonorPerfect →
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
