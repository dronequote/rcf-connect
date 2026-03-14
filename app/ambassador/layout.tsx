"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const publicPaths = ["/ambassador", "/ambassador/login", "/ambassador/verify"];

const navItems = [
  { href: "/ambassador/dashboard", label: "Dashboard" },
  { href: "/ambassador/leaderboard", label: "Leaderboard" },
  { href: "/ambassador/rewards", label: "Rewards" },
];

export default function AmbassadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isPublic = publicPaths.includes(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <header className="bg-[#1A5632] text-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/ambassador/dashboard" className="font-serif text-lg font-bold">
            The River Ambassadors
          </Link>
          <nav className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  pathname === item.href
                    ? "bg-white/20"
                    : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
