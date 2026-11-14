import React, { useId } from "react";
import type { TargetFeature } from "../../lib/schemas";
import { useAppStore } from "../../store/useAppStore";
import { walkBackRadiusKm, distanceM } from "../../lib/eva";
import { EVA_ASSUMPTIONS, EVA_ANCHOR_NOTE } from "../../lib/constants";
import { Footprints, AlertTriangle, ArrowRight, ShieldAlert } from "lucide-react";
import clsx from "clsx";

interface EvaPanelProps {
  targets: TargetFeature[];
}

export const EvaPanel: React.FC<EvaPanelProps> = ({ targets }) => {
  const {
    evaSettings,
    updateEvaSettings,
    selectedTargetId,
    selectTarget
  } = useAppStore();

  const { anchorId, speedKmh, durationH, siteWorkH, stops, stopMin } = evaSettings;

  const speedId = useId();
  const durationId = useId();
  const siteWorkId = useId();
  const stopsId = useId();
  const anchorSelectId = useId();

  // Find anchor target
  const anchorTarget = targets.find((t) => t.properties.id === anchorId) ?? targets[0];
  const anchorCoord = anchorTarget.geometry.coordinates;

  // Selected target or default to T7 for readout if none selected
  const activeTargetId = selectedTargetId ?? "T7";
  const activeTarget = targets.find((t) => t.properties.id === activeTargetId) ?? targets[0];
  const activeCoord = activeTarget.geometry.coordinates;

  // Calculate straight-line distance from anchor to active target
  const straightLineDistM = distanceM(
    [anchorCoord[0], anchorCoord[1]],
    [activeCoord[0], activeCoord[1]]
  );
  const straightLineDistKm = straightLineDistM / 1000;

  // Calculate walk-back radius under current assumptions
  const radiusKm = walkBackRadiusKm(speedKmh, durationH, siteWorkH, stops, stopMin);

  const isInside = straightLineDistKm <= radiusKm;

  return (
    <div className="h-full flex flex-col bg-surface text-text overflow-hidden font-body">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface-2/40 space-y-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-accent-soft text-accent border border-accent/30">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-text">EVA Sortie Planning</h1>
            <p className="text-[11px] text-muted">First-order out-and-back operational boundary</p>
          </div>
        </div>

        {/* Mandatory Anchor Caveat */}
        <div className="p-2.5 rounded-lg bg-bg border border-border text-[11px] text-dim flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
          <div>
            <strong className="text-muted block">NOTIONAL ANCHOR</strong>
            {EVA_ANCHOR_NOTE}
          </div>
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Sortie Readout Card */}
        <div className="p-3.5 rounded-xl bg-surface-2/70 border border-border space-y-2.5">
          <div className="flex items-center justify-between font-mono text-[11px] text-dim">
            <span>TARGET: {activeTarget.properties.code} ({activeTarget.properties.name})</span>
            <span
              className={clsx(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                isInside
                  ? "bg-success-soft text-success border-success/40"
                  : "bg-danger-soft text-danger border-danger/40"
              )}
            >
              {isInside ? "Inside radius" : "Outside radius"}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-sm font-medium text-text">
              Straight-line distance from anchor:{" "}
              <strong className="font-mono text-accent">{straightLineDistKm.toFixed(2)} km</strong>.
            </div>
            <div className="text-xs text-muted">
              Walk-back radius under these assumptions:{" "}
              <strong className="font-mono text-text">{radiusKm.toFixed(2)} km</strong>.
            </div>
          </div>

          <div className="pt-2 border-t border-border/60 text-[11px] text-muted leading-tight">
            Status: {isInside ? (
              <span className="text-success font-semibold">Inside radius</span>
            ) : (
              <span className="text-danger font-semibold">Outside radius</span>
            )}{" "}
            under an assumed {speedKmh.toFixed(1)} km/h speed and {durationH.toFixed(1)} h window.
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-3.5">
          <h2 className="text-xs font-mono tracking-wider uppercase text-dim">
            Sortie Model Assumptions
          </h2>

          {/* Anchor Target Selector */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor={anchorSelectId} className="text-muted font-medium">Sortie Anchor</label>
              <span className="font-mono text-accent">{anchorTarget.properties.code}</span>
            </div>
            <select
              id={anchorSelectId}
              value={anchorId}
              onChange={(e) => updateEvaSettings({ anchorId: e.target.value })}
              className="w-full bg-bg border border-border rounded-lg p-2 text-xs text-text focus:ring-1 focus:ring-accent outline-none"
            >
              {targets.map((t) => (
                <option key={t.properties.id} value={t.properties.id}>
                  {t.properties.code} · {t.properties.name}
                </option>
              ))}
            </select>
          </div>

          {/* Walking Speed */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label htmlFor={speedId} className="text-muted">Walking Speed</label>
              <span className="font-mono text-text font-semibold">{speedKmh.toFixed(1)} km/h</span>
            </div>
            <input
              id={speedId}
              type="range"
              min="0.5"
              max="3.0"
              step="0.1"
              value={speedKmh}
              onChange={(e) => updateEvaSettings({ speedKmh: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* EVA Duration */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label htmlFor={durationId} className="text-muted">EVA Total Duration</label>
              <span className="font-mono text-text font-semibold">{durationH.toFixed(1)} h</span>
            </div>
            <input
              id={durationId}
              type="range"
              min="2.0"
              max="8.0"
              step="0.5"
              value={durationH}
              onChange={(e) => updateEvaSettings({ durationH: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* On-Site Work Duration */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label htmlFor={siteWorkId} className="text-muted">On-Site Science Work</label>
              <span className="font-mono text-text font-semibold">{siteWorkH.toFixed(1)} h</span>
            </div>
            <input
              id={siteWorkId}
              type="range"
              min="0.0"
              max="4.0"
              step="0.5"
              value={siteWorkH}
              onChange={(e) => updateEvaSettings({ siteWorkH: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Number of Stops */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <label htmlFor={stopsId} className="text-muted">Stops (10 min each)</label>
              <span className="font-mono text-text font-semibold">{stops} stops ({stops * 10} min)</span>
            </div>
            <input
              id={stopsId}
              type="range"
              min="0"
              max="12"
              step="1"
              value={stops}
              onChange={(e) => updateEvaSettings({ stops: parseInt(e.target.value, 10) })}
              className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
        </div>

        {/* Target Reachability List relative to Anchor */}
        <div className="space-y-2 pt-2">
          <h2 className="text-xs font-mono tracking-wider uppercase text-dim">
            Target Reachability from {anchorTarget.properties.code}
          </h2>
          <div className="space-y-1.5">
            {targets.map((t) => {
              const dM = distanceM(
                [anchorCoord[0], anchorCoord[1]],
                [t.geometry.coordinates[0], t.geometry.coordinates[1]]
              );
              const dKm = dM / 1000;
              const inside = dKm <= radiusKm;
              const isSelected = selectedTargetId === t.properties.id;

              return (
                <button
                  key={t.properties.id}
                  onClick={() => selectTarget(t.properties.id)}
                  className={clsx(
                    "w-full flex items-center justify-between p-2 rounded-lg border text-xs text-left transition-colors",
                    isSelected
                      ? "bg-surface-2 border-accent text-text"
                      : "bg-surface-2/40 hover:bg-surface-2/80 border-border text-muted"
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono font-bold text-accent">{t.properties.code}</span>
                    <span className="truncate">{t.properties.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                    <span>{dKm.toFixed(1)} km</span>
                    <span
                      className={clsx(
                        "px-1.5 py-0.2 rounded text-[10px] font-semibold",
                        inside ? "text-success bg-success-soft" : "text-danger bg-danger-soft"
                      )}
                    >
                      {inside ? "Inside" : "Outside"}
                    </span>
                    <ArrowRight className="w-3 h-3 text-dim" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Non-negotiable Assumptions Callout */}
        <div className="p-3.5 rounded-lg bg-bg border border-border space-y-1.5 text-xs">
          <div className="text-accent font-mono text-[11px] uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Operational Constraints</span>
          </div>
          <p className="text-[11px] text-muted leading-relaxed">{EVA_ASSUMPTIONS}</p>
        </div>
      </div>
    </div>
  );
};
