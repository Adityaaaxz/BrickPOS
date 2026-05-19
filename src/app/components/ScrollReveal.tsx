"use client";

import { useRef, ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";

type RevealType = "fade-up" | "fade-down" | "slide-left" | "slide-right" | "zoom-in" | "flip-x" | "blur-in";

const variantMap: Record<RevealType, Variants> = {
  "fade-up": {
    hidden: { opacity: 0, y: 60, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "fade-down": {
    hidden: { opacity: 0, y: -60, filter: "blur(6px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
  "slide-left": {
    hidden: { opacity: 0, x: -80, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "slide-right": {
    hidden: { opacity: 0, x: 80, filter: "blur(4px)" },
    visible: { opacity: 1, x: 0, filter: "blur(0px)" },
  },
  "zoom-in": {
    hidden: { opacity: 0, scale: 0.7, filter: "blur(8px)" },
    visible: { opacity: 1, scale: 1, filter: "blur(0px)" },
  },
  "flip-x": {
    hidden: { opacity: 0, rotateX: -90, y: 40 },
    visible: { opacity: 1, rotateX: 0, y: 0 },
  },
  "blur-in": {
    hidden: { opacity: 0, filter: "blur(20px)", scale: 1.05 },
    visible: { opacity: 1, filter: "blur(0px)", scale: 1 },
  },
};

interface ScrollRevealProps {
  children: ReactNode;
  type?: RevealType;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  threshold?: number;
}

export default function ScrollReveal({
  children,
  type = "fade-up",
  delay = 0,
  duration = 0.7,
  className = "",
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, amount: threshold });

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variantMap[type]}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
