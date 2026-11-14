import React from "react";
import type { TargetProperties } from "../../lib/schemas";
import { ASSESSMENT_DEFINITIONS } from "../../lib/constants";
import { Tooltip } from "../common/Tooltip";
import { Info } from "lucide-react";

interface AssessmentChipsProps {
  properties: TargetProperties;
}

export const AssessmentChips: React.FC<AssessmentChipsProps> = ({ properties }) => {
  const { habitability, biosignature, science, access, distance_from_landing_km } = properties;

  return (
    <div className="grid grid-cols-2 gap-2.5 my-4">
      {/* Habitability Potential */}
      <div className="p-2.5 rounded-lg bg-surface-2/70 border border-[#5CC8D7]/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider uppercase text-cyan font-semibold">
            HABITABILITY
          </span>
          <Tooltip content={ASSESSMENT_DEFINITIONS.habitability}>
            <Info className="w-3 h-3 text-cyan/70 cursor-help" />
          </Tooltip>
        </div>
        <div className="mt-1.5">
          <div className="text-xs font-semibold text-text truncate" title={habitability}>
            {habitability}
          </div>
          <div className="text-[10px] text-muted">Past environment</div>
        </div>
      </div>

      {/* Biosignature Evidence */}
      <div className="p-2.5 rounded-lg bg-surface-2/70 border border-[#A78BFA]/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider uppercase text-violet font-semibold">
            BIOSIGNATURE
          </span>
          <Tooltip content={ASSESSMENT_DEFINITIONS.biosignature}>
            <Info className="w-3 h-3 text-violet/70 cursor-help" />
          </Tooltip>
        </div>
        <div className="mt-1.5">
          <div className="text-xs font-semibold text-text truncate" title={biosignature}>
            {biosignature.split("(")[0].trim()}
          </div>
          <div className="text-[10px] text-danger font-medium">Not confirmed</div>
        </div>
      </div>

      {/* Scientific Value */}
      <div className="p-2.5 rounded-lg bg-surface-2/70 border border-[#F2A33A]/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider uppercase text-accent font-semibold">
            SCIENTIFIC VALUE
          </span>
          <Tooltip content={ASSESSMENT_DEFINITIONS.science}>
            <Info className="w-3 h-3 text-accent/70 cursor-help" />
          </Tooltip>
        </div>
        <div className="mt-1.5">
          <div className="text-xs font-semibold text-text truncate" title={science}>
            {science}
          </div>
          <div className="text-[10px] text-muted">Geology &amp; alteration</div>
        </div>
      </div>

      {/* Accessibility */}
      <div className="p-2.5 rounded-lg bg-surface-2/70 border border-[#6FCF97]/30 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider uppercase text-success font-semibold">
            ACCESSIBILITY
          </span>
          <Tooltip content={ASSESSMENT_DEFINITIONS.access}>
            <Info className="w-3 h-3 text-success/70 cursor-help" />
          </Tooltip>
        </div>
        <div className="mt-1.5">
          <div className="text-xs font-semibold text-text truncate" title={access}>
            {access}
          </div>
          <div className="text-[10px] text-muted font-mono">
            {distance_from_landing_km.toFixed(1)} km from landing
          </div>
        </div>
      </div>
    </div>
  );
};
