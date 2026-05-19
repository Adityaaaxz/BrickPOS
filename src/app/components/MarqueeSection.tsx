"use client";

import { motion } from "framer-motion";

const themes = [
  { name: "Technic",       emoji: "🏎️", color: "#FF7E14" },
  { name: "Star Wars",     emoji: "🚀", color: "#0055BF" },
  { name: "City",          emoji: "🏙️", color: "#00852B" },
  { name: "Creator",       emoji: "🎢", color: "#FFD500" },
  { name: "Harry Potter",  emoji: "🏰", color: "#8B4DBF" },
  { name: "Architecture",  emoji: "🗽", color: "#A0A5A9" },
  { name: "Ninjago",       emoji: "🐉", color: "#D1120D" },
  { name: "Friends",       emoji: "🌸", color: "#E85298" },
  { name: "Minecraft",     emoji: "⛏️", color: "#00852B" },
  { name: "Ideas",         emoji: "💡", color: "#FFD500" },
  { name: "Icons",         emoji: "⭐", color: "#0055BF" },
  { name: "Duplo",         emoji: "🧒", color: "#D1120D" },
];

function ThemeChip({ name, emoji, color }: { name: string; emoji: string; color: string }) {
  return (
    <motion.div
      className="flex items-center gap-2.5 px-5 py-3 rounded-full flex-shrink-0 select-none"
      style={{
        background: `${color}12`,
        border: `1.5px solid ${color}30`,
        backdropFilter: "blur(12px)",
      }}
      whileHover={{ scale: 1.08, borderColor: `${color}80`, background: `${color}20` }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-sm font-bold whitespace-nowrap" style={{ color }}>
        {name}
      </span>
    </motion.div>
  );
}

export default function MarqueeSection() {
  const doubled = [...themes, ...themes]; // duplicate for seamless loop

  return (
    <section className="relative py-10 sm:py-14 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a1a]/80 to-transparent" />

      {/* Top rule */}
      <div className="h-px w-full mb-8" style={{
        background: "linear-gradient(90deg, transparent, rgba(255,213,0,0.2), rgba(209,18,13,0.2), rgba(0,85,191,0.2), transparent)"
      }} />

      {/* Label */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/20">All LEGO Themes</span>
      </div>

      {/* Row 1 — left scroll */}
      <div className="marquee-container mb-4">
        <div className="flex gap-3 animate-marquee" style={{ width: "max-content" }}>
          {doubled.map((t, i) => (
            <ThemeChip key={`a-${i}`} {...t} />
          ))}
        </div>
      </div>

      {/* Row 2 — right scroll (reversed) */}
      <div className="marquee-container">
        <div
          className="flex gap-3 animate-marquee"
          style={{ width: "max-content", animationDirection: "reverse", animationDuration: "40s" }}
        >
          {[...doubled].reverse().map((t, i) => (
            <ThemeChip key={`b-${i}`} {...t} />
          ))}
        </div>
      </div>

      {/* Bottom rule */}
      <div className="h-px w-full mt-8" style={{
        background: "linear-gradient(90deg, transparent, rgba(0,85,191,0.2), rgba(255,213,0,0.2), rgba(209,18,13,0.2), transparent)"
      }} />
    </section>
  );
}
