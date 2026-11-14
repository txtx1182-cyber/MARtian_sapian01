import React from "react";
import type { TargetFeature, EvidenceRecord, Source, PovData, TargetSlopes } from "../../lib/schemas";
import { formatCoordinate, formatElevation } from "../../lib/format";
import { T7_BIOSIGNATURE_COPY, SAMPLE_STATUS, POV_NOTE } from "../../lib/constants";
import { AssessmentChips } from "./AssessmentChips";
import { EvidenceCard } from "./EvidenceCard";
import { useAppStore } from "../../store/useAppStore";
import {
  AlertTriangle,
  Route as RouteIcon,
  HelpCircle,
  Copy,
  Check,
  Compass,
  Camera,
  ExternalLink,
  Clock,
  Mountain
} from "lucide-react";
import clsx from "clsx";

interface TargetDetailProps {
  target: TargetFeature;
  evidenceRecords: EvidenceRecord[];
  allSources: Source[];
  povList?: PovData;
  targetSlopes?: TargetSlopes;
}

export const TargetDetail: React.FC<TargetDetailProps> = ({
  target,
  evidenceRecords,
  allSources,
  povList = [],
  targetSlopes = []
}) => {
  const { activeDetailTab, setActiveDetailTab, setRouteMode } = useAppStore();
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const {
    id,
    code,
    name,
    unit,
    elevation_m,
    summary,
    context,
    confidence,
    confidence_reason,
    coordinate_note,
    distance_from_landing_km,
    nearest_rover_sol,
    source_ids
  } = target.properties;

  const [lon, lat] = target.geometry.coordinates;

  const isT7 = id === "T7";
  const isT8OrT9 = id === "T8" || id === "T9";
  const targetEvidence = evidenceRecords.filter((e) => e.target_id === id);

  const isOnRoute = ["T1", "T2", "T4", "T6", "T7"].includes(id);

  // Slope info from targetSlopes
  const slopeInfo = targetSlopes.find((s) => s.target_id === id);

  // POV item for this target
  const targetPov = povList.find((p) => p.target_id === id);

  const handleCopyCitation = (source: Source) => {
    navigator.clipboard.writeText(source.citation);
    setCopiedId(source.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-surface text-text overflow-hidden">
      {/* Target Header */}
      <div className="p-4 border-b border-border bg-surface-2/40 space-y-2.5 shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-accent text-sm bg-accent-soft px-2 py-0.5 rounded border border-accent/40">
                {code}
              </span>
              <h1 className="text-base font-display font-bold text-text leading-tight">{name}</h1>
            </div>
            <div className="text-xs text-muted mt-1">{unit}</div>
          </div>
        </div>

        {/* Coordinates and Elevation */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-dim">
          <span>{formatCoordinate(lat, lon)}</span>
          <span>·</span>
          <span>{formatElevation(elevation_m)}</span>
        </div>

        {/* Non-negotiable T7 Biosignature Banner */}
        {isT7 && (
          <div
            role="status"
            className="p-3 rounded-lg bg-danger-soft border-l-4 border-danger space-y-1.5"
          >
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
              <div className="text-xs font-bold text-danger leading-snug">
                {T7_BIOSIGNATURE_COPY}
              </div>
            </div>
            <div className="text-[11px] text-text/80 leading-normal pl-6">
              Compelling redox-driven organic associations; biological interpretation remains
              unresolved and sample return is required.
            </div>

            {/* Required Sample Status Statement */}
            <div className="pt-1.5 border-t border-danger/30 text-[11px] text-text/90 leading-relaxed pl-6">
              <strong className="text-accent uppercase font-mono block text-[10px]">
                SAMPLE RETURN STATUS:
              </strong>
              {SAMPLE_STATUS}
            </div>
          </div>
        )}

        {/* Confidence Row */}
        <div className="p-2.5 rounded-lg bg-surface border border-border text-xs space-y-1">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span className="text-dim">ASSESSMENT CONFIDENCE:</span>
            <strong className="text-accent">{confidence}</strong>
          </div>
          <div className="text-muted text-[11px] leading-snug">{confidence_reason}</div>
        </div>

        {/* Four Separate Assessment Chips */}
        <AssessmentChips properties={target.properties} />

        {/* Tab Navigation */}
        <div className="flex border-b border-border pt-1 -mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveDetailTab("why")}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors",
              activeDetailTab === "why"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-muted hover:text-text"
            )}
          >
            Why This Target
          </button>
          <button
            onClick={() => setActiveDetailTab("access")}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors",
              activeDetailTab === "access"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-muted hover:text-text"
            )}
          >
            Access &amp; Terrain
          </button>
          <button
            onClick={() => setActiveDetailTab("views")}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors",
              activeDetailTab === "views"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-muted hover:text-text"
            )}
          >
            POV Views {targetPov ? "●" : ""}
          </button>
          <button
            onClick={() => setActiveDetailTab("sources")}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium border-b-2 whitespace-nowrap transition-colors",
              activeDetailTab === "sources"
                ? "border-accent text-accent font-semibold"
                : "border-transparent text-muted hover:text-text"
            )}
          >
            Sources ({source_ids.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeDetailTab === "why" && (
          <div className="space-y-4">
            {/* Target Summary */}
            <div className="space-y-2">
              <h3 className="text-xs font-mono tracking-wider uppercase text-dim">Summary</h3>
              <p className="text-xs text-text leading-relaxed bg-surface-2/40 p-3 rounded-lg border border-border">
                {summary}
              </p>
              {context && (
                <div className="text-[12px] text-muted leading-relaxed px-1">
                  <strong className="text-dim font-mono text-[11px] block mb-0.5">
                    GEOLOGICAL CONTEXT:
                  </strong>
                  {context}
                </div>
              )}
            </div>

            {/* Evidence Records List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono tracking-wider uppercase text-dim">
                  Documented Evidence Records ({targetEvidence.length})
                </h3>
              </div>

              {targetEvidence.length === 0 ? (
                <div className="p-4 rounded-lg bg-surface-2/40 border border-border text-xs text-muted text-center">
                  No discrete evidence records loaded for this target. See general context above.
                </div>
              ) : (
                <div className="space-y-3">
                  {targetEvidence.map((ev) => (
                    <EvidenceCard key={ev.id} evidence={ev} allSources={allSources} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeDetailTab === "access" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-surface-2/60 rounded-lg border border-border">
                <div className="text-dim font-mono text-[10px] uppercase">
                  Along rover track from landing
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base font-display font-semibold text-text">
                    {distance_from_landing_km.toFixed(1)} km
                  </span>
                  {isT8OrT9 && (
                    <span className="px-1.5 py-0.5 bg-danger-soft text-danger border border-danger/30 text-[9px] font-mono rounded uppercase">
                      Data under review
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 bg-surface-2/60 rounded-lg border border-border">
                <div className="text-dim font-mono text-[10px] uppercase">Nearest Rover Sol</div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-base font-display font-semibold text-text">
                    Sol {nearest_rover_sol}
                  </span>
                  {isT8OrT9 && (
                    <span className="px-1.5 py-0.5 bg-danger-soft text-danger border border-danger/30 text-[9px] font-mono rounded uppercase">
                      Under review
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* HiRISE DTM Terrain Slope Section */}
            <div className="p-3 rounded-lg bg-surface-2/60 border border-border space-y-1">
              <div className="flex items-center gap-1.5 text-dim font-mono text-[11px] uppercase">
                <Mountain className="w-3.5 h-3.5 text-success" />
                <span>Terrain slope near target (HiRISE DTM, median within 100 m)</span>
              </div>
              <div className="text-sm font-semibold text-text pt-0.5">
                {slopeInfo && slopeInfo.covered && slopeInfo.median_slope_deg !== null ? (
                  <span>
                    <strong className="text-accent">{slopeInfo.median_slope_deg.toFixed(1)}°</strong>{" "}
                    <span className="text-xs text-muted font-normal font-mono">
                      (~{(100 * Math.tan((slopeInfo.median_slope_deg * Math.PI) / 180)).toFixed(1)}% grade)
                    </span>
                  </span>
                ) : (
                  <span className="text-muted font-mono text-xs">No DTM coverage</span>
                )}
              </div>
              <p className="text-[10.5px] text-dim">
                Derived from 5 m baseline resampled HiRISE DTM. Not a trafficability model.
              </p>
            </div>

            {/* Route Callout if on Route */}
            {isOnRoute && (
              <div className="p-3 rounded-lg bg-accent-soft/60 border border-accent/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-accent flex items-center gap-1.5">
                    <RouteIcon className="w-3.5 h-3.5" />
                    <span>Included in Fixed Science Traverse R1</span>
                  </span>
                </div>
                <p className="text-xs text-muted">
                  This target is a designated waypoint along the 23.3 km traverse transect.
                </p>
                <button
                  onClick={() => setRouteMode(true)}
                  className="px-3 py-1.5 bg-accent text-bg font-semibold text-xs rounded hover:bg-accent/90 transition-colors flex items-center gap-1.5"
                >
                  <RouteIcon className="w-3.5 h-3.5" />
                  <span>Show On Science Route</span>
                </button>
              </div>
            )}

            {/* Coordinate Caveats */}
            <div className="p-3 rounded-lg bg-surface-2/50 border border-border space-y-1.5">
              <div className="text-dim font-mono text-[11px] uppercase flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-cyan" />
                <span>Coordinate Localization Note</span>
              </div>
              <p className="text-xs text-muted leading-relaxed">{coordinate_note}</p>
            </div>

            {/* Non-negotiable Terrain Caveats */}
            <div className="p-3 rounded-lg bg-bg border border-border space-y-2 text-xs">
              <div className="text-accent font-mono text-[11px] uppercase flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Traverse Limitations &amp; Assumptions</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-muted text-[11px]">
                <li>Rover traverse segment; not a human-rated route.</li>
                <li>Elevations from rover localization, not a HiRISE DTM.</li>
                <li>No obstacle, boulder, dust, or communications model applied.</li>
                <li>Access assessment is a qualitative research judgment, not a safety rating.</li>
              </ul>
            </div>
          </div>
        )}

        {/* POV Views Tab */}
        {activeDetailTab === "views" && (
          <div className="space-y-4">
            {targetPov ? (
              <div className="p-4 rounded-xl bg-surface-2/60 border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-cyan" />
                    <span className="font-display font-semibold text-text text-sm">
                      {targetPov.image_id}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-dim flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Sol {targetPov.sol}</span>
                  </span>
                </div>

                <div className="rounded-lg bg-bg border border-border p-3 space-y-2">
                  <p className="text-xs text-text leading-relaxed">{targetPov.caption}</p>
                  <div className="text-[11px] font-mono text-dim space-y-0.5">
                    <div>Instrument: <strong className="text-muted">{targetPov.instrument}</strong></div>
                    <div>Credit: {targetPov.credit}</div>
                  </div>
                </div>

                {/* Non-negotiable POV Note */}
                <div className="p-2.5 rounded bg-accent-soft/40 border border-accent/30 text-[11px] font-mono text-accent">
                  {POV_NOTE}
                </div>

                <a
                  href={targetPov.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline font-mono"
                >
                  <span>Open NASA Photojournal Record ({targetPov.image_id})</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-surface-2/30 border border-border text-center space-y-2">
                <Camera className="w-8 h-8 text-dim mx-auto" />
                <div className="text-xs font-medium text-text">No rover image loaded for this target.</div>
                <p className="text-[11px] text-muted max-w-xs mx-auto">
                  Only verified NASA mission images with checked IDs are included.
                </p>
              </div>
            )}
          </div>
        )}

        {activeDetailTab === "sources" && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono tracking-wider uppercase text-dim">
              Associated Citations ({source_ids.length})
            </h3>
            <div className="space-y-2">
              {source_ids.map((sId) => {
                const src = allSources.find((s) => s.id === sId);
                if (!src) return null;
                const isCopied = copiedId === src.id;

                return (
                  <div
                    key={src.id}
                    className="p-3 rounded-lg bg-surface-2/60 border border-border space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs text-text font-medium leading-snug">
                        <span className="font-mono text-accent mr-1.5">[{src.id}]</span>
                        {src.citation}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline break-all"
                      >
                        {src.url}
                      </a>
                      <button
                        onClick={() => handleCopyCitation(src)}
                        className="flex items-center gap-1 px-2 py-1 bg-surface hover:bg-surface-2 text-muted hover:text-text rounded border border-border transition-colors shrink-0 ml-2"
                        title="Copy Citation"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-success" />
                            <span className="text-success">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
