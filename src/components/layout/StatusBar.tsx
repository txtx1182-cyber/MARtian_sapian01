import React from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  STATUS_CRS,
  STATUS_BASEMAP,
  PLANNING_AID_COPY,
  BASEMAP_TOOLTIP
} from "../../lib/constants";
import { Tooltip } from "../common/Tooltip";
import { ExternalLink, AlertCircle } from "lucide-react";

export const StatusBar: React.FC = () => {
  const openAbout = useAppStore((s) => s.openAbout);

  return (
    <footer className="h-auto sm:h-8 border-t border-border bg-surface px-4 py-1 sm:py-0 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-dim select-none z-20">
      {/* Left: CRS */}
      <div className="flex items-center gap-2 py-0.5 sm:py-0">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan inline-block" />
        <span className="text-muted tracking-tight">{STATUS_CRS}</span>
      </div>

      {/* Center: Basemap Caveat */}
      <div className="flex items-center gap-1.5 py-0.5 sm:py-0 text-amber-400/90">
        <AlertCircle className="w-3 h-3 text-accent shrink-0" />
        <Tooltip content={BASEMAP_TOOLTIP} position="top">
          <span className="underline decoration-dotted underline-offset-2 cursor-help">
            {STATUS_BASEMAP}
          </span>
        </Tooltip>
      </div>

      {/* Right: Planning aid copy + Data & methods */}
      <div className="flex items-center gap-3 py-0.5 sm:py-0">
        <span className="text-muted hidden md:inline">{PLANNING_AID_COPY}</span>
        <button
          onClick={() => openAbout(true)}
          className="text-accent hover:text-accent/80 hover:underline flex items-center gap-1 focus:outline-none"
        >
          <span>Data &amp; methods</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>
    </footer>
  );
};
