import React, { useState, useId } from "react";
import type { RouteProfile } from "../../lib/schemas";
import { formatElevation, formatDistance } from "../../lib/format";

interface ElevationProfileProps {
  profileData: RouteProfile;
}

export const ElevationProfile: React.FC<ElevationProfileProps> = ({ profileData }) => {
  const { summary, profile } = profileData;
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const inputId = useId();

  if (!profile || profile.length === 0) return null;

  const minElev = summary.elevation_min_m; // ~ -2585.9
  const maxElev = summary.elevation_max_m; // ~ -2349.3
  const totalDist = summary.distance_km; // 23.3

  // Margins & Dimensions
  const svgWidth = 600;
  const svgHeight = 150;
  const padLeft = 45;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 25;

  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;

  const elevRange = maxElev - minElev || 1;

  const getX = (distKm: number) => {
    return padLeft + (distKm / totalDist) * plotWidth;
  };

  const getY = (elevM: number) => {
    return padTop + plotHeight - ((elevM - minElev) / elevRange) * plotHeight;
  };

  // Build SVG path
  const pathData = profile
    .map((pt, i) => `${i === 0 ? "M" : "L"} ${getX(pt.distance_km).toFixed(1)},${getY(pt.elevation_m).toFixed(1)}`)
    .join(" ");

  // Closed path for fill area
  const areaData = `${pathData} L ${getX(profile[profile.length - 1].distance_km).toFixed(1)},${(padTop + plotHeight).toFixed(1)} L ${getX(profile[0].distance_km).toFixed(1)},${(padTop + plotHeight).toFixed(1)} Z`;

  // Waypoints along route
  const waypoints = [
    { code: "T1", distKm: 0.0, label: "Landing" },
    { code: "T2", distKm: 2.1, label: "Séítah" },
    { code: "T4", distKm: 9.8, label: "Delta Front" },
    { code: "T6", distKm: 21.8, label: "Neretva Entry" },
    { code: "T7", distKm: 23.3, label: "Bright Angel" }
  ];

  const activePoint = hoverIndex !== null && hoverIndex >= 0 && hoverIndex < profile.length
    ? profile[hoverIndex]
    : profile[profile.length - 1];

  const accessibleSummary = `Route elevation profile: Distance ${totalDist.toFixed(1)} km, elevation from ${formatElevation(minElev)} to ${formatElevation(maxElev)}, cumulative ascent ${summary.ascent_m.toFixed(1)} m, descent ${summary.descent_m.toFixed(1)} m.`;

  return (
    <div className="space-y-2 bg-surface-2/60 rounded-xl p-3 border border-border">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-dim uppercase tracking-wider">Elevation Profile (R1)</span>
        <span className="text-accent font-semibold">
          {activePoint ? `${formatDistance(activePoint.distance_km)} · ${formatElevation(activePoint.elevation_m)}` : ""}
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto block select-none"
          role="img"
          aria-label={accessibleSummary}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="profileGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F2A33A" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F2A33A" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={padLeft}
            y1={padTop}
            x2={svgWidth - padRight}
            y2={padTop}
            stroke="#24303D"
            strokeDasharray="3 3"
          />
          <line
            x1={padLeft}
            y1={padTop + plotHeight / 2}
            x2={svgWidth - padRight}
            y2={padTop + plotHeight / 2}
            stroke="#24303D"
            strokeDasharray="3 3"
          />
          <line
            x1={padLeft}
            y1={padTop + plotHeight}
            x2={svgWidth - padRight}
            y2={padTop + plotHeight}
            stroke="#24303D"
          />

          {/* Elevation Labels on Y axis */}
          <text
            x={padLeft - 6}
            y={padTop + 4}
            textAnchor="end"
            className="fill-dim text-[10px] font-mono"
          >
            {Math.round(maxElev)} m
          </text>
          <text
            x={padLeft - 6}
            y={padTop + plotHeight / 2 + 3}
            textAnchor="end"
            className="fill-dim text-[10px] font-mono"
          >
            {Math.round((maxElev + minElev) / 2)} m
          </text>
          <text
            x={padLeft - 6}
            y={padTop + plotHeight + 3}
            textAnchor="end"
            className="fill-dim text-[10px] font-mono"
          >
            {Math.round(minElev)} m
          </text>

          {/* Area Fill & Profile Stroke */}
          <path d={areaData} fill="url(#profileGradient)" />
          <path d={pathData} fill="none" stroke="#F2A33A" strokeWidth="2.5" strokeLinecap="round" />

          {/* Waypoint vertical tick markers */}
          {waypoints.map((wp) => {
            const x = getX(wp.distKm);
            return (
              <g key={wp.code}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + plotHeight}
                  stroke="#5CC8D7"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity="0.6"
                />
                <circle cx={x} cy={padTop + plotHeight} r="3" fill="#5CC8D7" />
                <text
                  x={x}
                  y={padTop + plotHeight + 14}
                  textAnchor="middle"
                  className="fill-cyan text-[10px] font-mono font-bold"
                >
                  {wp.code}
                </text>
              </g>
            );
          })}

          {/* Hover indicator point */}
          {activePoint && (
            <g>
              <line
                x1={getX(activePoint.distance_km)}
                y1={padTop}
                x2={getX(activePoint.distance_km)}
                y2={padTop + plotHeight}
                stroke="#E8EEF5"
                strokeWidth="1"
                opacity="0.8"
              />
              <circle
                cx={getX(activePoint.distance_km)}
                cy={getY(activePoint.elevation_m)}
                r="4.5"
                fill="#F2A33A"
                stroke="#0B0F14"
                strokeWidth="2"
              />
            </g>
          )}

          {/* Interactive touch/mouse overlay rects */}
          {profile.map((pt, i) => (
            <rect
              key={i}
              x={getX(pt.distance_km) - plotWidth / profile.length / 2}
              y={padTop}
              width={plotWidth / profile.length}
              height={plotHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseEnter={() => setHoverIndex(i)}
            />
          ))}
        </svg>

        {/* Accessible Keyboard Slider for screen-reader & keyboard users */}
        <div className="pt-1">
          <label htmlFor={inputId} className="sr-only">
            Scrub route elevation profile
          </label>
          <input
            id={inputId}
            type="range"
            min={0}
            max={profile.length - 1}
            value={hoverIndex ?? profile.length - 1}
            onChange={(e) => setHoverIndex(Number(e.target.value))}
            className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>
      </div>
    </div>
  );
};
