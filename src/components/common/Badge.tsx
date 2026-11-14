import React from "react";
import clsx from "clsx";

export type BadgeVariant =
  | "observation"
  | "interpretation"
  | "hypothesis"
  | "public"
  | "counter-evidence"
  | "measured"
  | "analogue"
  | "model"
  | "unknown"
  | "assumption"
  | "amber"
  | "cyan"
  | "violet"
  | "green"
  | "red"
  | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant | string;
  className?: string;
  title?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = "default", className, title }) => {
  const normalized = (variant || "").toLowerCase();

  const getStyles = () => {
    switch (normalized) {
      case "observation":
      case "cyan":
        return "bg-cyan-soft text-cyan border-[#5CC8D7]/30";
      case "interpretation":
      case "amber":
        return "bg-accent-soft text-accent border-[#F2A33A]/30";
      case "hypothesis":
      case "violet":
        return "bg-[#25183E] text-violet border-[#A78BFA]/30";
      case "counter-evidence":
      case "red":
      case "danger":
        return "bg-danger-soft text-danger border-[#E05D5D]/40 font-semibold";
      case "public interpretation":
      case "public":
        return "bg-[#18222E] text-muted border-border";
      case "measured":
      case "green":
      case "success":
        return "bg-success-soft text-success border-[#6FCF97]/30";
      case "analogue":
        return "bg-accent-soft text-accent border-[#F2A33A]/30";
      case "model":
        return "bg-[#25183E] text-violet border-[#A78BFA]/30";
      case "unknown":
        return "bg-[#16212C] text-muted border-dashed border-[#6B7C90]/50";
      case "assumption":
        return "bg-[#2A2016] text-[#E5A85A] border-[#E5A85A]/30";
      default:
        return "bg-surface-2 text-muted border-border";
    }
  };

  return (
    <span
      title={title}
      className={clsx(
        "inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase border",
        getStyles(),
        className
      )}
    >
      {children}
    </span>
  );
};
