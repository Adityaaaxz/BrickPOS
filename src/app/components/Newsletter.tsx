"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle, Loader2, Zap, Gift, Bell } from "lucide-react";
import LegoButton from "./LegoButton";
import ScrollReveal from "./ScrollReveal";

// Mini confetti
interface Piece {
  id: number; x: number; color: string;
  delay: number; duration: number; size: number; shape: string;
}

function Confetti({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!active) { setPieces([]); return; }
    const colors = ["#D1120D","#FFD500","#0055BF","#00852B","#FF7E14","#8B4DBF","#E85298"];
    const shapes = ["square","circle","rect"];
    setPieces(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 0.8,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 10,
      shape: shapes[i % shapes.length],
    })));
    const t = setTimeout(() => setPieces([]), 5000);
    return () => clearTimeout(t);
  }, [active]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.shape === "rect" ? p.size * 0.4 : p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

const perks = [
  { icon: Zap,  text: "Exclusive early access to new sets", color: "#FFD500" },
  { icon: Gift, text: "Members-only deals & discounts",    color: "#D1120D" },
  { icon: Bell, text: "Building tips & tutorials",         color: "#0055BF" },
];

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [confetti, setConfetti] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Welcome to the Builders Club!");
        setEmail("");
        setConfetti(true);
        setTimeout(() => setConfetti(false), 100);
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
    setTimeout(() => setStatus("idle"), 5000);
  }, [email]);

  return (
    <section id="newsletter" className="relative py-20 sm:py-32 overflow-hidden">
      <Confetti active={confetti} />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-lego-dark via-[#150808] to-lego-dark" />

      {/* Animated brick floaters */}
      {[
        { top: "10%",  left: "5%",  color: "#D1120D", size: 60, delay: 0,   dur: 6 },
        { top: "70%",  left: "8%",  color: "#0055BF", size: 80, delay: 1,   dur: 8 },
        { top: "20%",  right: "6%", color: "#FFD500", size: 50, delay: 0.5, dur: 7 },
        { top: "65%",  right: "4%", color: "#00852B", size: 70, delay: 1.5, dur: 9 },
        { top: "45%",  left: "2%",  color: "#8B4DBF", size: 40, delay: 0.8, dur: 5 },
        { top: "30%",  right: "2%", color: "#FF7E14", size: 55, delay: 1.2, dur: 7 },
      ].map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-md pointer-events-none hidden sm:block"
          style={{
            width: b.size, height: b.size * 0.6,
            background: `linear-gradient(135deg, ${b.color}20, ${b.color}08)`,
            border: `1px solid ${b.color}20`,
            top: b.top,
            left: "left" in b ? b.left : undefined,
            right: "right" in b ? (b as {right:string}).right : undefined,
          }}
          animate={{ y: [0, -20, 0], rotate: [i * 10, i * 10 + 8, i * 10] }}
          transition={{ duration: b.dur, delay: b.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <ScrollReveal type="zoom-in">
          <motion.div
            className="rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, rgba(209,18,13,0.08), rgba(255,213,0,0.04), rgba(0,85,191,0.06))",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(24px)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Header bar */}
            <div className="h-1 w-full" style={{
              background: "linear-gradient(90deg, #D1120D, #FFD500, #0055BF, #00852B)"
            }} />

            <div className="p-8 sm:p-14 text-center">
              {/* Animated icon */}
              <motion.div
                className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center"
                style={{
                  background: "rgba(209,18,13,0.12)",
                  border: "2px solid rgba(209,18,13,0.25)",
                  boxShadow: "0 0 30px rgba(209,18,13,0.2), inset 0 1px 0 rgba(255,255,255,0.1)",
                }}
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-lego-red" />
              </motion.div>

              <h2 className="text-3xl sm:text-5xl font-black text-white mb-3">
                Join the <span className="shimmer-text-red">Builders</span> Club
              </h2>
              <p className="text-sm sm:text-base text-white/50 mb-8 max-w-md mx-auto leading-relaxed">
                Get exclusive deals, early access to new sets, and building tips delivered to your inbox.
              </p>

              {/* Perks */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-10">
                {perks.map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-white/50">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
                    {text}
                  </div>
                ))}
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
                  <motion.input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="w-full pl-11 pr-4 py-4 rounded-2xl text-white text-sm"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1.5px solid rgba(255,255,255,0.1)",
                      outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(255,213,0,0.5)";
                      e.target.style.boxShadow = "0 0 0 3px rgba(255,213,0,0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>
                <LegoButton type="submit" variant="red" size="md" disabled={status === "loading"}>
                  {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
                </LegoButton>
              </form>

              {/* Status messages */}
              <AnimatePresence>
                {status === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-5 flex items-center justify-center gap-2 text-lego-green font-semibold"
                  >
                    <CheckCircle className="w-5 h-5" /> {message} 🎉
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: [0, -6, 6, -4, 4, 0] }}
                    exit={{ opacity: 0 }}
                    className="mt-5 text-lego-red font-medium text-sm"
                  >
                    {message}
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="mt-5 text-xs text-white/20">No spam, ever. Unsubscribe anytime. 🧱</p>
            </div>
          </motion.div>
        </ScrollReveal>
      </div>
    </section>
  );
}
