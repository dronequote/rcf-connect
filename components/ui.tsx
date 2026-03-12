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
    <footer className="text-center py-6 px-4 space-y-3">
      <div className="flex justify-center gap-6">
        <a
          href="https://www.facebook.com/theriverchristianfellowship"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          Facebook
        </a>
        <a
          href="https://www.instagram.com/therivertwinfalls"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          Instagram
        </a>
        <a
          href="https://www.youtube.com/@TheRiverChristianFellowship"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/40 hover:text-white/70 transition-colors text-sm"
        >
          YouTube
        </a>
      </div>
      <p className="text-white/30 text-[10px]">
        4002 N 3300 E · Twin Falls, ID 83301 · (208) 733-3133
      </p>
      <p className="text-white/20 text-[10px]">
        Sundays 10:00 AM & 6:00 PM
      </p>
    </footer>
  );
}
