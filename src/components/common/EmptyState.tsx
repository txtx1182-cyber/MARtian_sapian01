import React from "react";
import { Compass, Sparkles, Mountain, ShieldCheck, ArrowRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { ASSESSMENT_DEFINITIONS } from "../../lib/constants";

export const EmptyState: React.FC = () => {
  const selectTarget = useAppStore((s) => s.selectTarget);

  return (
    <div className="p-6 h-full flex flex-col justify-between overflow-y-auto">
      <div className="space-y-6">
        <div>
          <div className="inline-flex p-2.5 rounded-lg bg-surface-2 border border-border text-accent mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-display font-semibold text-text">Select a Target</h2>
          <p className="text-xs text-muted mt-1 leading-relaxed">
            Select a target from the map or left list to inspect its documented observations,
            competing interpretations, and accessibility metrics.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-mono tracking-wider uppercase text-dim">
            The Four Independent Dimensions
          </h3>

          <div className="space-y-2.5">
            <div className="p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="flex items-center gap-2 text-cyan font-medium text-xs mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Habitability Potential</span>
              </div>
              <p className="text-[12px] text-muted leading-normal">
                {ASSESSMENT_DEFINITIONS.habitability}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="flex items-center gap-2 text-violet font-medium text-xs mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Biosignature Evidence</span>
              </div>
              <p className="text-[12px] text-muted leading-normal">
                {ASSESSMENT_DEFINITIONS.biosignature}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="flex items-center gap-2 text-accent font-medium text-xs mb-1">
                <Mountain className="w-3.5 h-3.5" />
                <span>Scientific Value</span>
              </div>
              <p className="text-[12px] text-muted leading-normal">
                {ASSESSMENT_DEFINITIONS.science}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/60 border border-border">
              <div className="flex items-center gap-2 text-success font-medium text-xs mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Accessibility</span>
              </div>
              <p className="text-[12px] text-muted leading-normal">
                {ASSESSMENT_DEFINITIONS.access}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-border space-y-2 mt-6">
        <p className="text-xs text-dim font-mono">Suggested starting points:</p>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => selectTarget("T7")}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium bg-surface-2 hover:bg-surface-2/80 text-text border border-border rounded-lg transition-colors group"
          >
            <span>T7 · Bright Angel (Potential biosignature)</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={() => selectTarget("T2")}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium bg-surface-2 hover:bg-surface-2/80 text-text border border-border rounded-lg transition-colors group"
          >
            <span>T2 · Séítah (Igneous & alteration history)</span>
            <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
