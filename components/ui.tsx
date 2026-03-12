"use client";

import { useState, type ReactNode } from "react";

export function Tag({
  children,
  active,
  onClick,
}: {
  children: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-[7px] rounded-full text-xs font-semibold transition-all border-2 ${
        active
          ? "border-church-main bg-church-main/[0.07] text-church-main"
          : "border-gray-200 bg-white text-gray-500"
      }`}
    >
      {active ? "✓ " : ""}
      {children}
    </button>
  );
}

export function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  multiline = false,
}: {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const inputClass = `w-full px-3.5 py-[11px] rounded-[10px] border-2 text-sm font-sans outline-none transition-colors bg-white text-gray-900 ${
    focused ? "border-church-main" : "border-gray-200"
  }`;

  return (
    <div className="mb-3.5 flex-1">
      {label && (
        <div className="text-[11px] font-bold text-gray-400 tracking-[0.5px] mb-[5px] uppercase">
          {label}
        </div>
      )}
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          className={inputClass}
        />
      )}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  full = false,
  type = "button",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "gold" | "outline" | "ghost" | "white";
  full?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base =
    "px-6 py-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-transform active:scale-[0.97]";
  const variants = {
    primary:
      "bg-gradient-to-br from-church-main to-church-light text-white shadow-[0_4px_14px_rgba(26,86,50,0.19)]",
    gold: "bg-gradient-to-br from-gold to-[#d4b85e] text-church-dark shadow-[0_4px_14px_rgba(200,168,78,0.19)]",
    outline: "bg-white text-church-main border-2 border-church-main",
    ghost: "bg-church-soft text-church-main",
    white:
      "bg-white/15 text-white border border-white/25",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${full ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
}

export function Header({
  title,
  subtitle,
  onBack,
  gold = false,
}: {
  title: string;
  subtitle?: string;
  onBack: () => void;
  gold?: boolean;
}) {
  return (
    <div
      className={`-mx-5 -mt-5 mb-6 px-5 pt-5 pb-7 rounded-b-3xl ${
        gold
          ? "bg-gradient-to-br from-gold to-[#d4b85e]"
          : "bg-gradient-to-br from-church-main to-church-light"
      }`}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border-none bg-white/15 text-white text-xs font-semibold mb-4 cursor-pointer"
      >
        ← Back
      </button>
      <h2 className="font-serif text-white text-2xl font-normal m-0 mb-1">
        {title}
      </h2>
      {subtitle && (
        <p className="font-sans text-white/75 text-[13px] m-0">{subtitle}</p>
      )}
    </div>
  );
}

export function Section({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="text-[11px] font-bold text-gold tracking-[1.5px] mb-2.5 uppercase">
        {label}
      </div>
      {children}
    </div>
  );
}

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] border border-gray-200 ${className}`}
    >
      {children}
    </div>
  );
}

export function Footer() {
  return (
    <footer className="text-center pt-8 pb-6 px-4 space-y-4">
      {/* Color social icons */}
      <div className="flex justify-center items-center gap-5">
        <a
          href="https://www.facebook.com/therivertwinfalls"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
          aria-label="Facebook"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#1877F2" />
            <path d="M16.5 12.05h-2.5V10c0-.83.17-1.4 1.4-1.4h1.1V6.1c-.5-.05-1.1-.1-1.6-.1-2.35 0-3.9 1.45-3.9 4.05v2h-2v2.7h2V21h2.75v-6.25h2.15l.6-2.7z" fill="white" />
          </svg>
        </a>
        <a
          href="https://www.instagram.com/theriverchristianfellowship/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
          aria-label="Instagram"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="url(#ig)" />
            <defs>
              <linearGradient id="ig" x1="2" y1="22" x2="22" y2="2">
                <stop stopColor="#FFDC80" />
                <stop offset=".5" stopColor="#F56040" />
                <stop offset="1" stopColor="#C13584" />
              </linearGradient>
            </defs>
            <rect x="6" y="6" width="12" height="12" rx="3.5" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" fill="none" />
            <circle cx="16.5" cy="7.5" r="1" fill="white" />
          </svg>
        </a>
        <a
          href="https://www.youtube.com/@TheRiverChristianFellowship/featured"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
          aria-label="YouTube"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#FF0000" />
            <path d="M10 15.5V8.5L16 12L10 15.5Z" fill="white" />
          </svg>
        </a>
        <a
          href="https://www.tiktok.com/@theriverchristianfellowship"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
          aria-label="TikTok"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#000000" />
            <path d="M16.5 8.5c-.8-.5-1.3-1.3-1.5-2.2V6h-2.2v9.2c0 1.3-1.1 2.3-2.4 2.3s-2.4-1-2.4-2.3 1.1-2.3 2.4-2.3c.3 0 .5 0 .7.1v-2.3c-.2 0-.5-.1-.7-.1-2.5 0-4.6 2-4.6 4.6S8 21.7 10.4 21.7s4.1-1.6 4.1-4.1v-5c.8.6 1.8.9 2.9.9v-2.3c-.4 0-.7-.1-1-.2-.3-.2-.6-.3-.9-.5z" fill="white" />
          </svg>
        </a>
        <a
          href="https://maps.app.goo.gl/qfsBrSpLFvJ9pBvD6"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:scale-110 transition-transform"
          aria-label="Google Maps"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="#ffffff" />
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" />
            <circle cx="12" cy="9" r="2.5" fill="#ffffff" />
          </svg>
        </a>
      </div>

      {/* Address with Google Maps link */}
      <a
        href="https://maps.app.goo.gl/qfsBrSpLFvJ9pBvD6"
        target="_blank"
        rel="noopener noreferrer"
        className="block text-white/70 text-xs no-underline hover:text-white transition-colors"
      >
        4002 N 3300 E · Twin Falls, ID 83301
      </a>
      <p className="text-white/70 text-xs">
        (208) 733-3133
      </p>
      <p className="text-white/60 text-xs">
        Sundays 10:00 AM &amp; 6:00 PM
      </p>
    </footer>
  );
}
