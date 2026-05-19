"use client";

import { motion } from "framer-motion";
import { playBrickClick } from "@/lib/sound";
import React from "react";

type LegoButtonProps = {
  children: React.ReactNode;
  variant?: "red" | "yellow" | "blue";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  icon?: React.ReactNode;
};

export default function LegoButton({
  children,
  variant = "red",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  icon,
}: LegoButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-4 text-base",
  };

  const handleClick = () => {
    playBrickClick();
    onClick?.();
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={`lego-btn lego-btn-${variant} ${sizeClasses[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {/* Stud decorations */}
      <span className="absolute -top-1 left-1/4 w-3 h-3 rounded-full bg-white/20" />
      <span className="absolute -top-1 right-1/4 w-3 h-3 rounded-full bg-white/20" />
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.button>
  );
}
