import React from "react";
import { useAppStore } from "../../store/useAppStore";
import type { AppData } from "../../lib/schemas";
import { TargetDetail } from "../targets/TargetDetail";
import { RoutePanel } from "../route/RoutePanel";
import { EvaPanel } from "../eva/EvaPanel";
import { EmptyState } from "../common/EmptyState";
import { X } from "lucide-react";

interface RightPanelProps {
  appData: AppData;
}

export const RightPanel: React.FC<RightPanelProps> = ({ appData }) => {
  const { selectedTargetId, selectTarget, routeMode, evaMode } = useAppStore();

  const selectedTarget = appData.targets.features.find(
    (f) => f.properties.id === selectedTargetId
  );

  return (
    <aside className="w-full h-full bg-surface border-l border-border flex flex-col relative z-20">
      {/* Close target selection button when target is selected */}
      {selectedTarget && (
        <button
          onClick={() => selectTarget(null)}
          aria-label="Deselect target"
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface-2 transition-colors focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {selectedTarget ? (
        <TargetDetail
          target={selectedTarget}
          evidenceRecords={appData.evidence}
          allSources={appData.sources}
          povList={appData.pov}
          targetSlopes={appData.targetSlopes}
        />
      ) : evaMode ? (
        <EvaPanel targets={appData.targets.features} />
      ) : routeMode ? (
        <RoutePanel
          routeData={appData.route}
          routeProfile={appData.routeProfile}
          targets={appData.targets.features}
        />
      ) : (
        <EmptyState />
      )}
    </aside>
  );
};
