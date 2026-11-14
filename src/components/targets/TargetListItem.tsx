import React from "react";
import type { TargetFeature } from "../../lib/schemas";
import { useAppStore } from "../../store/useAppStore";
import clsx from "clsx";

interface TargetListItemProps {
  target: TargetFeature;
  isSelected: boolean;
}

export const TargetListItem: React.FC<TargetListItemProps> = ({ target, isSelected }) => {
  const { selectTarget, setHoveredTarget, objective } = useAppStore();
  const { id, code, name, unit, confidence, habitability, biosignature, science, access } =
    target.properties;

  // Confidence dot
  const getConfidenceDot = (conf: string) => {
    const lower = conf.toLowerCase();
    if (lower.includes("high")) {
      return (
        <span
          title={`Confidence: ${conf}`}
          className="w-2.5 h-2.5 rounded-full bg-accent inline-block shrink-0"
        />
      );
    }
    if (lower.includes("moderate")) {
      return (
        <span
          title={`Confidence: ${conf}`}
          className="w-2.5 h-2.5 rounded-full bg-accent/70 inline-block shrink-0"
        />
      );
    }
    if (lower.includes("low")) {
      return (
        <span
          title={`Confidence: ${conf}`}
          className="w-2.5 h-2.5 rounded-full border border-accent/60 bg-accent/30 inline-block shrink-0"
        />
      );
    }
    return (
      <span
        title={`Confidence: ${conf}`}
        className="w-2.5 h-2.5 rounded-full border border-dim inline-block shrink-0"
      />
    );
  };

  // Determine which chips to show in list row (at most 3: primary for current objective, science, access)
  const getDisplayChips = () => {
    if (objective === "habitability") {
      return [
        { label: "Hab", val: habitability, color: "text-cyan bg-cyan-soft border-cyan/30" },
        { label: "Sci", val: science, color: "text-accent bg-accent-soft border-accent/30" },
        { label: "Acc", val: access, color: "text-success bg-success-soft border-success/30" }
      ];
    }
    if (objective === "biosignature") {
      return [
        { label: "Bio", val: biosignature, color: "text-violet bg-[#25183E] border-violet/30" },
        { label: "Sci", val: science, color: "text-accent bg-accent-soft border-accent/30" },
        { label: "Acc", val: access, color: "text-success bg-success-soft border-success/30" }
      ];
    }
    if (objective === "accessibility") {
      return [
        { label: "Acc", val: access, color: "text-success bg-success-soft border-success/30" },
        { label: "Sci", val: science, color: "text-accent bg-accent-soft border-accent/30" },
        { label: "Hab", val: habitability, color: "text-cyan bg-cyan-soft border-cyan/30" }
      ];
    }
    // Default Geological:
    return [
      { label: "Sci", val: science, color: "text-accent bg-accent-soft border-accent/30" },
      { label: "Hab", val: habitability, color: "text-cyan bg-cyan-soft border-cyan/30" },
      { label: "Acc", val: access, color: "text-success bg-success-soft border-success/30" }
    ];
  };

  return (
    <button
      role="listitem"
      aria-selected={isSelected}
      onClick={() => selectTarget(id)}
      onMouseEnter={() => setHoveredTarget(id)}
      onMouseLeave={() => setHoveredTarget(null)}
      className={clsx(
        "w-full text-left p-3 rounded-lg border transition-all text-xs focus:outline-none focus:ring-2 focus:ring-accent group",
        isSelected
          ? "bg-surface-2 border-accent border-l-4 shadow-md text-text"
          : "bg-surface hover:bg-surface-2/60 border-border text-muted hover:text-text"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate">
          <span className="font-mono font-bold text-accent text-xs">{code}</span>
          <span className="font-semibold text-text truncate group-hover:text-accent transition-colors">
            {name}
          </span>
        </div>
        {getConfidenceDot(confidence)}
      </div>

      <div className="text-[11px] text-dim truncate mt-1">{unit}</div>

      <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
        {getDisplayChips().map((chip, idx) => (
          <span
            key={idx}
            className={clsx(
              "px-1.5 py-0.5 rounded text-[10px] font-mono border truncate",
              chip.color
            )}
            title={`${chip.label}: ${chip.val}`}
          >
            {chip.label}: {chip.val.split(/[(–\-]/)[0].trim()}
          </span>
        ))}
      </div>
    </button>
  );
};
