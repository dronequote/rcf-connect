import Link from "next/link";
import { Footer } from "@/components/ui";

const paths = [
  { id: "new", icon: "👋", label: "I'm New Here", sub: "Welcome! Let us connect with you" },
  { id: "involved", icon: "❤️", label: "Get Involved", sub: "Find your place in community" },
  { id: "give", icon: "🎁", label: "Give", sub: "Support the mission" },
  { id: "families", icon: "👨‍👩‍👧‍👦", label: "Kids & Families", sub: "Programs for every age" },
  { id: "events", icon: "📅", label: "What's Happening", sub: "Events, groups & services" },
  { id: "agape", icon: "🍽️", label: "Agape Meals", sub: "Free community meals" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-church-dark via-church-main to-church-light relative">
      {/* Subtle grid overlay */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.025) 10px, rgba(255,255,255,0.025) 11px)",
        }}
      />

      <div className="max-w-[460px] mx-auto px-[22px] pt-11 pb-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-2.5 animate-fade-up">
          <div className="inline-flex w-[58px] h-[58px] rounded-full border-2 border-white/85 items-center justify-center text-white font-bold text-base tracking-wider">
            RCF
          </div>
        </div>

        {/* Heading */}
        <div className="animate-fade-up">
          <h1 className="font-serif text-white text-[30px] text-center mb-0.5 font-normal">
            Welcome to
          </h1>
          <h2 className="font-serif text-gold text-4xl text-center mb-1.5 font-normal italic">
            The River
          </h2>
          <p className="font-sans text-white/55 text-[13px] text-center mb-8">
            River Christian Fellowship · Twin Falls, Idaho
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="flex flex-col gap-2.5">
          {paths.map((p, i) => (
            <Link
              key={p.id}
              href={`/connect/${p.id}`}
              className={`animate-fade-up delay-${i + 1} flex items-center gap-3.5 w-full bg-white/[0.09] backdrop-blur-sm border border-white/[0.12] rounded-[14px] px-[18px] py-[15px] text-left no-underline transition-all hover:bg-white/[0.16] hover:translate-x-[3px]`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                  p.id === "give"
                    ? "bg-gradient-to-br from-gold to-[#d4b85e]"
                    : "bg-white/10"
                }`}
              >
                {p.icon}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-white text-[15px]">
                  {p.label}
                </div>
                <div className="text-white/50 text-xs">{p.sub}</div>
              </div>
              <div className="text-white/35 text-base">→</div>
            </Link>
          ))}
        </div>

        {/* Invite button */}
        <div className="animate-fade-up delay-7 mt-5">
          <Link
            href="/connect/invite"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white/70 text-sm font-medium no-underline hover:bg-white/[0.14] transition-all"
          >
            💌 Invite a Friend
          </Link>
        </div>

        <div className="animate-fade-up delay-7">
          <Footer />
        </div>
      </div>
    </div>
  );
}
