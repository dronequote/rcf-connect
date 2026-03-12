"use client";

import { useRouter } from "next/navigation";
import { Btn } from "@/components/ui";

export default function SuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-church-dark via-church-main to-church-light flex items-center justify-center">
      <div className="text-center px-7 py-10 animate-fade-up">
        <div className="w-[72px] h-[72px] rounded-full border-[3px] border-white/80 inline-flex items-center justify-center text-[32px] mb-5 animate-checkmark">
          ✓
        </div>
        <h2 className="font-serif text-white text-[28px] font-normal mb-2.5">
          You&apos;re Connected!
        </h2>
        <p className="text-white/75 text-sm mb-2 leading-relaxed">
          We&apos;re so glad you&apos;re here. Someone from our team will reach
          out soon.
        </p>
        <p className="text-gold text-[13px] italic mb-7">
          &ldquo;But the Lord stood at my side and gave me strength.&rdquo; — 2
          Timothy 4:17
        </p>
        <Btn onClick={() => router.push("/")} variant="white">
          Back to Home
        </Btn>
      </div>
    </div>
  );
}
