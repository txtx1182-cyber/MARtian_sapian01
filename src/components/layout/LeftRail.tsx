import React from "react";
import type { TargetFeature, EvidenceRecord } from "../../lib/schemas";
import { TargetList } from "../targets/TargetList";
import { MapLegend } from "../map/MapLegend";

interface LeftRailProps {
  targets: TargetFeature[];
  evidenceRecords: EvidenceRecord[];
  hasGeologicUnits?: boolean;
  hasSlopeRaster?: boolean;
}

export const LeftRail: React.FC<LeftRailProps> = ({
  targets,
  evidenceRecords,
  hasGeologicUnits = true,
  hasSlopeRaster = false
}) => {
  return (
    <nav
      aria-label="Target navigation"
      className="w-full h-full bg-surface border-r border-border flex flex-col overflow-hidden select-none z-20"
    >
      <div className="flex-1 overflow-hidden">
        <TargetList targets={targets} evidenceRecords={evidenceRecords} />
      </div>
      <MapLegend hasGeologicUnits={hasGeologicUnits} hasSlopeRaster={hasSlopeRaster} />
    </nav>
  );
};
