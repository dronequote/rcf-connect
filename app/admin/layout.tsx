"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, type ReactNode } from "react";
import { isStaffLoggedIn, getStaffUser, staffLogout } from "@/lib/staff-auth";
import type { StaffUser } from "@/lib/staff-auth";

const navItems = [
  { href: "/admin", icon: "📊", label: "Dashboard" },
  { href: "/admin/bulletin", icon: "📰", label: "Bulletin" },
  { href: "/admin/visitors", icon: "👥", label: "Visitors" },
  { href: "/admin/agape", icon: "🍽️", label: "Agape" },
  { href: "/admin/ai", icon: "🤖", label: "AI Tools" },
  { href: "/admin/social", icon: "📱", label: "Social" },
  { href: "/admin/ambassadors", icon: "🤝", label: "Ambassadors" },
  { href: "/admin/help", icon: "❓", label: "Help" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StaffUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Skip auth check for the verify page
    if (pathname.startsWith("/admin/auth/verify")) {
      setChecked(true);
      return;
    }

    if (!isStaffLoggedIn()) {
      router.replace("/login");
      return;
    }

    const staffUser = getStaffUser();
    if (staffUser) {
      setUser(staffUser);
    }
    setChecked(true);
  }, [pathname, router]);

  const handleSignOut = () => {
    staffLogout();
    router.push("/login");
  };

  // Don't render layout for verify page — it has its own full-screen UI
  if (pathname.startsWith("/admin/auth/verify")) {
    return <>{children}</>;
  }

  // Show nothing until auth check completes
  if (!checked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    );
  }

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "?";
  const displayName = user ? `${user.firstName} ${user.lastName}` : "";
  const displayEmail = user?.email || "";
  const displayRole =
    user?.role === "superadmin" ? "super-admin" : user?.role || "";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-56 bg-church-dark flex-col fixed inset-y-0 left-0 z-40">
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              RCF
            </div>
            <div>
              <p className="text-white text-sm font-semibold">The River</p>
              <p className="text-white/50 text-[10px]">Staff Dashboard</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm no-underline transition-colors ${
                  active
                    ? "bg-white/15 text-white font-semibold"
                    : "text-white/60 hover:bg-white/10 hover:text-white/90"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Logged-in user + sign out */}
        <div className="px-3 py-4 border-t border-white/10">
          {user && (
            <div className="flex items-center gap-2 px-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gold/30 flex items-center justify-center text-gold text-[10px] font-bold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-semibold truncate">
                  {displayName}
                </p>
                <p className="text-white/40 text-[9px] truncate">
                  {displayEmail}
                </p>
              </div>
              {displayRole && (
                <span className="px-1.5 py-0.5 rounded bg-gold/20 text-gold text-[8px] font-bold uppercase shrink-0">
                  {displayRole}
                </span>
              )}
            </div>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 text-white/50 text-xs hover:text-white/80 bg-transparent border-none cursor-pointer w-full"
          >
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-church-dark z-40">
        <div className="flex items-center gap-2 px-4 py-3">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white text-[10px] font-bold">
            RCF
          </div>
          <p className="text-white text-sm font-semibold flex-1">
            Staff Dashboard
          </p>
          {user && (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-gold/30 flex items-center justify-center text-gold text-[8px] font-bold">
                {initials}
              </div>
              <button
                onClick={handleSignOut}
                className="text-white/50 text-[10px] bg-transparent border-none cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
        <nav className="flex overflow-x-auto px-2 pb-2 gap-1 scrollbar-hide">
          {navItems.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs whitespace-nowrap no-underline shrink-0 ${
                  active
                    ? "bg-white/20 text-white font-semibold"
                    : "text-white/50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-56 mt-[88px] md:mt-0">{children}</main>
    </div>
  );
}
