import React from "react";
import { NO_CONFIRMED_LIFE, GEOLOGIC_NOTE, SLOPE_NOTE } from "../../lib/constants";
import { useAppStore } from "../../store/useAppStore";
import { Layers, Footprints } from "lucide-react";
import { Tooltip } from "../common/Tooltip";
import clsx from "clsx";

interface MapLegendProps {
  hasGeologicUnits?: boolean;
  hasSlopeRaster?: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({
  hasGeologicUnits = true,
  hasSlopeRaster = false
}) => {
  const {
    layers,
    toggleLayer,
    routeMode,
    toggleRoute,
    evaMode,
    toggleEvaMode
  } = useAppStore();

  return (
    <div className="p-3 border-t border-border bg-surface-2/40 space-y-3 shrink-0">
      {/* Layer Toggles Panel */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs font-mono text-dim uppercase">
          <Layers className="w-3.5 h-3.5 text-accent" />
          <span>Active Map Layers</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono">
          {/* Basemap */}
          <button
            onClick={() => toggleLayer("basemap")}
            className={clsx(
              "px-2 py-0.5 rounded border transition-colors",
              layers.basemap
                ? "bg-surface-2 text-text border-accent/40"
                : "bg-surface text-dim border-border opacity-60"
            )}
          >
            HiRISE
          </button>

          {/* Rover Traverse */}
          <button
            onClick={() => toggleLayer("traverse")}
            className={clsx(
              "px-2 py-0.5 rounded border transition-colors",
              layers.traverse
                ? "bg-cyan-soft text-cyan border-cyan/40"
                : "bg-surface text-dim border-border opacity-60"
            )}
          >
            Traverse
          </button>

          {/* Route R1 */}
          <button
            onClick={toggleRoute}
            className={clsx(
              "px-2 py-0.5 rounded border transition-colors",
              routeMode
                ? "bg-accent-soft text-accent border-accent/50"
                : "bg-surface text-dim border-border opacity-60"
            )}
          >
            Route R1
          </button>

          {/* EVA Radius */}
          <button
            onClick={toggleEvaMode}
            className={clsx(
              "px-2 py-0.5 rounded border transition-colors flex items-center gap-1",
              evaMode
                ? "bg-accent-soft text-accent border-accent/50"
                : "bg-surface text-dim border-border opacity-60"
            )}
          >
            <Footprints className="w-3 h-3" />
            <span>EVA</span>
          </button>

          {/* Geologic Units */}
          {hasGeologicUnits ? (
            <Tooltip content={GEOLOGIC_NOTE}>
              <button
                onClick={() => toggleLayer("geologic")}
                className={clsx(
                  "px-2 py-0.5 rounded border transition-colors",
                  layers.geologic
                    ? "bg-[#25183E] text-violet border-violet/50"
                    : "bg-surface text-dim border-border opacity-60"
                )}
              >
                Geology (SIM 3464)
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Data not loaded">
              <button
                disabled
                className="px-2 py-0.5 rounded border bg-surface text-dim border-border opacity-40 cursor-not-allowed"
              >
                Geology
              </button>
            </Tooltip>
          )}

          {/* Slope Raster (Disabled if no DTM raster) */}
          {hasSlopeRaster ? (
            <Tooltip content={SLOPE_NOTE}>
              <button
                onClick={() => toggleLayer("slope")}
                className={clsx(
                  "px-2 py-0.5 rounded border transition-colors",
                  layers.slope
                    ? "bg-success-soft text-success border-success/50"
                    : "bg-surface text-dim border-border opacity-60"
                )}
              >
                Slope
              </button>
            </Tooltip>
          ) : (
            <Tooltip content="Data not loaded (HiRISE DTM raster not bundled)">
              <button
                disabled
                className="px-2 py-0.5 rounded border bg-surface text-dim border-border opacity-40 cursor-not-allowed"
              >
                Slope
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {/* Evidence Classes Legend */}
      <div className="space-y-1">
        <div className="text-[10px] font-mono text-dim uppercase">Evidence Classes</div>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan inline-block" />
            <span className="text-muted">Observation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-accent inline-block" />
            <span className="text-muted">Interpretation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-violet inline-block" />
            <span className="text-muted">Hypothesis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-danger inline-block" />
            <span className="text-muted">Counter-evidence</span>
          </div>
        </div>
      </div>

      {/* Scientific caveat microcopy */}
      <div className="pt-1 border-t border-border/60 text-[10.5px] font-mono text-dim leading-tight">
        {NO_CONFIRMED_LIFE}
      </div>
    </div>
  );
};
