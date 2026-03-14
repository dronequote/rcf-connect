"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import { isMemberLoggedIn } from "@/lib/member-auth";

const tabs = [
  { href: "/member", icon: "🏠", label: "Home" },
  { href: "/member/sermon", icon: "📖", label: "Sermon" },
  { href: "/member/events", icon: "📅", label: "Events" },
  { href: "/member/give", icon: "🎁", label: "Give" },
  { href: "/member/prayer", icon: "🙏", label: "Prayer" },
];

export default function MemberLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isMemberLoggedIn()) {
      router.replace("/login");
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm pb-20">
      {children}
      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="max-w-[460px] mx-auto flex">
          {tabs.map((t) => {
            const active =
              t.href === "/member"
                ? pathname === "/member"
                : pathname.startsWith(t.href);
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`flex-1 flex flex-col items-center py-2 pt-2.5 no-underline transition-colors ${
                  active ? "text-church-main" : "text-gray-400"
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <span className="text-[10px] font-semibold mt-0.5">
                  {t.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
