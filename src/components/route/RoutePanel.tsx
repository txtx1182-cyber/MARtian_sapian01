import React from "react";
import type { RouteGeoJSON, RouteProfile, TargetFeature } from "../../lib/schemas";
import { ElevationProfile } from "./ElevationProfile";
import { ROUTE_WARNING } from "../../lib/constants";
import { AlertTriangle, MapPin, ArrowRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

interface RoutePanelProps {
  routeData: RouteGeoJSON;
  routeProfile: RouteProfile;
  targets: TargetFeature[];
}

export const RoutePanel: React.FC<RoutePanelProps> = ({
  routeData,
  routeProfile,
  targets
}) => {
  const { selectTarget, evaSettings } = useAppStore();
  const feature = routeData.features[0];
  const props = feature?.properties;
  const summary = routeProfile.summary;

  const waypoints = props?.waypoints ?? ["T1", "T2", "T4", "T6", "T7"];

  // Net elevation change: +215 m (last profile elevation minus first)
  const profile = routeProfile.profile;
  const firstElev = profile[0]?.elevation_m ?? -2569.9;
  const lastElev = profile[profile.length - 1]?.elevation_m ?? -2354.5;
  const netElevationM = lastElev - firstElev;

  // Dynamic EVA comparison multiplier
  const effectiveWalkHours = Math.max(
    evaSettings.durationH - evaSettings.siteWorkH - (evaSettings.stops * evaSettings.stopMin) / 60,
    0.1
  );
  const totalEvaPathLengthKm = evaSettings.speedKmh * effectiveWalkHours;
  const evaMultiplier = (summary.distance_km / totalEvaPathLengthKm).toFixed(1);

  return (
    <div className="h-full flex flex-col bg-surface text-text overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-surface-2/40 space-y-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-bg">
            {props?.id ?? "R1"}
          </span>
          <h1 className="text-base font-display font-bold text-text">Science Traverse R1</h1>
        </div>
        <p className="text-xs text-muted">
          Landing → Séítah → Delta Front → Neretva Vallis → Bright Angel
        </p>

        {/* Mandatory Warning Callout */}
        <div
          role="alert"
          className="p-3 rounded-lg bg-accent-soft border-l-4 border-accent flex items-start gap-2.5"
        >
          <AlertTriangle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-accent tracking-wide">{ROUTE_WARNING}</div>
            <div className="text-[11px] text-text/80 leading-normal">
              Follows Perseverance daily localizations (sols 0–1189). This is a science transect,
              not an engineering-certified route.
            </div>
          </div>
        </div>

        {/* EVA Path Length Comparison Statement */}
        <div className="text-[11.5px] font-mono text-cyan bg-cyan-soft/40 p-2.5 rounded border border-cyan/30">
          R1 is about <strong className="text-text">{evaMultiplier}×</strong> the total EVA path length under current EVA assumptions ({totalEvaPathLengthKm.toFixed(1)} km total walk).
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Exact Relabelled Summary Statistics */}
        <div className="space-y-2">
          {/* Lead with Net elevation change */}
          <div className="p-3 rounded-lg bg-surface-2 border border-border">
            <span className="text-[10px] font-mono tracking-wider uppercase text-dim block">
              Net elevation change
            </span>
            <div className="text-lg font-display font-bold text-accent mt-0.5">
              +{Math.round(netElevationM)} m
            </div>
            <div className="text-[11px] text-muted font-mono">
              Computed from first to last vertex ({firstElev.toFixed(1)} m to {lastElev.toFixed(1)} m)
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-lg bg-surface-2/70 border border-border">
              <span className="text-[10px] font-mono tracking-wider uppercase text-dim block">
                Total distance
              </span>
              <div className="text-base font-display font-bold text-text mt-0.5">
                {summary.distance_km.toFixed(1)} km
              </div>
              <div className="text-[10px] text-muted font-mono">340 rover vertices</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/70 border border-border">
              <span className="text-[10px] font-mono tracking-wider uppercase text-dim block leading-tight">
                Max segment grade (daily rover localization, noisy)
              </span>
              <div className="text-base font-display font-bold text-accent mt-0.5">
                +{summary.max_grade_pct.toFixed(1)}%
              </div>
              <div className="text-[10px] text-muted font-mono">
                Min: {summary.min_grade_pct.toFixed(1)}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/70 border border-border">
              <span className="text-[10px] font-mono tracking-wider uppercase text-dim block leading-tight">
                Cumulative ascent (sum of segment elevation deltas)
              </span>
              <div className="text-base font-display font-bold text-success mt-0.5">
                +{Math.round(summary.ascent_m)} m
              </div>
              <div className="text-[10px] text-muted font-mono">Raw sum: +452.3 m</div>
            </div>

            <div className="p-3 rounded-lg bg-surface-2/70 border border-border">
              <span className="text-[10px] font-mono tracking-wider uppercase text-dim block leading-tight">
                Cumulative descent (sum of segment elevation deltas)
              </span>
              <div className="text-base font-display font-bold text-muted mt-0.5">
                −{Math.round(summary.descent_m)} m
              </div>
              <div className="text-[10px] text-muted font-mono">Raw sum: −236.8 m</div>
            </div>
          </div>
        </div>

        {/* Elevation Profile Line Chart */}
        <ElevationProfile profileData={routeProfile} />

        {/* Waypoints List */}
        <div className="space-y-2">
          <h2 className="text-xs font-mono tracking-wider uppercase text-dim">
            Traverse Waypoints ({waypoints.length})
          </h2>
          <div className="space-y-1.5">
            {waypoints.map((wpCode, index) => {
              const target = targets.find(
                (t) => t.properties.code === wpCode || t.properties.id === wpCode
              );
              return (
                <button
                  key={wpCode}
                  onClick={() => target && selectTarget(target.properties.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg bg-surface-2/50 hover:bg-surface-2 border border-border text-xs text-left transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-accent w-6">
                      {wpCode}
                    </span>
                    <span className="text-text font-medium group-hover:text-accent transition-colors">
                      {target?.properties.name ?? wpCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-dim text-[11px] font-mono">
                    <span>Leg {index + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assumptions List from route_profile.json */}
        <div className="p-3.5 rounded-lg bg-bg border border-border space-y-2 text-xs">
          <div className="text-accent font-mono text-[11px] uppercase flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" />
            <span>Documented Route Assumptions</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-muted text-[11px] leading-relaxed">
            {routeProfile.assumptions.map((assump, idx) => (
              <li key={idx}>{assump}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
