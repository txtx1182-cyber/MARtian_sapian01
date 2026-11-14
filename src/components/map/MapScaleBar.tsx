import React from "react";
import { metersPerPixel } from "../../lib/eva";

interface MapScaleBarProps {
  zoom: number;
  latitude?: number;
}

export const MapScaleBar: React.FC<MapScaleBarProps> = ({ zoom, latitude = 18.45 }) => {
  const mPerPx = metersPerPixel(zoom, latitude);
  // Target width around 100px
  const targetDistanceM = mPerPx * 100;

  // Round to friendly distance on Mars
  const friendlyDistancesM = [
    50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000
  ];

  let chosenDistanceM = friendlyDistancesM[0];
  for (const d of friendlyDistancesM) {
    if (Math.abs(d - targetDistanceM) < Math.abs(chosenDistanceM - targetDistanceM)) {
      chosenDistanceM = d;
    }
  }

  const widthPx = Math.max(30, Math.round(chosenDistanceM / mPerPx));
  const label = chosenDistanceM >= 1000 ? `${(chosenDistanceM / 1000).toFixed(0)} km` : `${chosenDistanceM} m`;

  return (
    <div
      role="note"
      aria-label={`Mars scale bar: ${label}`}
      className="bg-surface/90 backdrop-blur-sm border border-border px-2 py-1 rounded text-[10px] font-mono text-dim flex flex-col items-center select-none shadow-md"
    >
      <div className="text-text font-semibold mb-0.5">{label}</div>
      <div
        style={{ width: `${widthPx}px` }}
        className="h-1.5 border-b-2 border-l-2 border-r-2 border-accent"
      />
      <div className="text-[8.5px] text-muted tracking-tight mt-0.5">Mars 2000 Sphere</div>
    </div>
  );
};
