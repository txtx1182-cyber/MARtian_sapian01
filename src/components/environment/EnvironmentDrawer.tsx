import React from "react";
import type { EnvironmentData, Source } from "../../lib/schemas";
import { Drawer } from "../common/Drawer";
import { Badge } from "../common/Badge";
import { SourceLink } from "../targets/SourceLink";
import { useAppStore } from "../../store/useAppStore";
import { RADIATION_COPY, WATER_ICE_COPY } from "../../lib/constants";
import { AlertCircle, Radio, CloudRain, Mountain, Footprints } from "lucide-react";
import clsx from "clsx";

interface EnvironmentDrawerProps {
  environmentData: EnvironmentData;
  allSources: Source[];
}

export const EnvironmentDrawer: React.FC<EnvironmentDrawerProps> = ({
  environmentData,
  allSources
}) => {
  const { environmentOpen, openEnvironment } = useAppStore();

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "radiation":
        return <Radio className="w-4 h-4 text-accent" />;
      case "atmosphere":
        return <CloudRain className="w-4 h-4 text-cyan" />;
      case "terrain":
        return <Mountain className="w-4 h-4 text-success" />;
      case "water ice":
        return <AlertCircle className="w-4 h-4 text-muted" />;
      case "mobility":
        return <Footprints className="w-4 h-4 text-accent" />;
      default:
        return <AlertCircle className="w-4 h-4 text-dim" />;
    }
  };

  return (
    <Drawer
      isOpen={environmentOpen}
      onClose={() => openEnvironment(false)}
      title="Environmental Constraints"
      subtitle="Jezero surface environment: Measured telemetry, Analogues, Models, Unknowns, and Assumptions"
      widthClass="max-w-2xl"
    >
      <div className="space-y-4">
        {environmentData.items.map((item) => {
          const isRadiation = item.domain.toLowerCase() === "radiation";
          const isIce = item.domain.toLowerCase() === "water ice";
          const isMobility = item.domain.toLowerCase() === "mobility";

          return (
            <div
              key={item.id}
              className={clsx(
                "p-4 rounded-xl border space-y-3 transition-colors",
                isRadiation
                  ? "bg-accent-soft/40 border-accent/60"
                  : isIce
                  ? "bg-surface-2/60 border-dashed border-[#6B7C90]/60"
                  : isMobility
                  ? "bg-surface-2/60 border-[#F2A33A]/30"
                  : "bg-surface-2/60 border-border"
              )}
            >
              {/* Header: Domain, Icon, Kind Badge, Confidence */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getDomainIcon(item.domain)}
                  <span className="font-display font-bold text-sm text-text">{item.domain}</span>
                  <Badge variant={item.kind}>{item.kind}</Badge>
                </div>
                <span className="text-[11px] font-mono text-dim">
                  Status: <strong className="text-muted">{item.confidence}</strong>
                </span>
              </div>

              {/* Headline */}
              <h3 className="text-sm font-semibold text-text">{item.headline}</h3>

              {/* Detail */}
              <p className="text-xs text-muted leading-relaxed">{item.detail}</p>

              {/* Enforced Non-negotiable Statements */}
              {isRadiation && (
                <div className="p-3 rounded-lg bg-bg border border-accent/40 text-xs font-medium text-accent space-y-0.5">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Radiation Constraint</span>
                  </div>
                  <p className="text-text/90 font-normal">{RADIATION_COPY}</p>
                </div>
              )}

              {isIce && (
                <div className="p-3 rounded-lg bg-bg border border-border text-xs text-muted space-y-0.5">
                  <div className="font-bold text-dim font-mono">WATER ICE CONSTRAINT</div>
                  <p className="text-text/90 font-normal">{WATER_ICE_COPY}</p>
                </div>
              )}

              {/* Display / Operational meaning */}
              {item.display && (
                <div className="text-[11px] font-mono text-dim bg-bg/60 p-2.5 rounded border border-border">
                  <span className="text-accent uppercase mr-1.5">Context:</span>
                  {item.display}
                </div>
              )}

              {/* Sources */}
              {item.source_ids.length > 0 && (
                <SourceLink sourceIds={item.source_ids} allSources={allSources} />
              )}
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};
