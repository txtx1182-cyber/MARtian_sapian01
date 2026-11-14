import React, { useMemo } from "react";
import type { TargetFeature, EvidenceRecord } from "../../lib/schemas";
import { useAppStore } from "../../store/useAppStore";
import { sortTargets, getObjectiveSortLabel } from "../../lib/sort";
import { TargetListItem } from "./TargetListItem";
import { Search, RotateCcw } from "lucide-react";

interface TargetListProps {
  targets: TargetFeature[];
  evidenceRecords: EvidenceRecord[];
}

export const TargetList: React.FC<TargetListProps> = ({ targets, evidenceRecords }) => {
  const { objective, setObjective, selectedTargetId, searchQuery, setSearchQuery } = useAppStore();

  const sortedTargets = useMemo(() => {
    return sortTargets(targets, objective, evidenceRecords);
  }, [targets, objective, evidenceRecords]);

  const filteredTargets = useMemo(() => {
    if (!searchQuery.trim()) return sortedTargets;
    const q = searchQuery.toLowerCase().trim();
    return sortedTargets.filter(
      (t) =>
        t.properties.name.toLowerCase().includes(q) ||
        t.properties.code.toLowerCase().includes(q) ||
        t.properties.unit.toLowerCase().includes(q) ||
        t.properties.context.toLowerCase().includes(q) ||
        t.properties.summary.toLowerCase().includes(q)
    );
  }, [sortedTargets, searchQuery]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border space-y-2 shrink-0 bg-surface">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-display font-semibold text-text">Science Targets</h2>
            <span className="px-1.5 py-0.2 rounded-full bg-surface-2 text-[11px] font-mono text-muted border border-border">
              {filteredTargets.length}
            </span>
          </div>

          {objective !== "geological" && (
            <button
              onClick={() => setObjective("geological")}
              className="flex items-center gap-1 text-[11px] text-accent hover:text-accent/80 font-mono transition-colors"
              title="Reset to Geological History"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Dynamic sort description */}
        <p className="text-[11px] font-mono text-dim leading-tight">
          {getObjectiveSortLabel(objective)}
        </p>

        {/* Search */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-dim" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search targets, units, evidence…"
            aria-label="Search targets"
            className="w-full pl-8 pr-3 py-1.5 bg-bg/80 border border-border rounded-lg text-xs text-text placeholder:text-dim focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
      </div>

      {/* Target Items */}
      <div
        role="list"
        aria-label="Target list"
        className="flex-1 overflow-y-auto p-3 space-y-2.5"
      >
        {filteredTargets.length === 0 ? (
          <div className="p-6 text-center text-xs text-muted">
            No science targets match "{searchQuery}"
          </div>
        ) : (
          filteredTargets.map((target) => (
            <TargetListItem
              key={target.properties.id}
              target={target}
              isSelected={selectedTargetId === target.properties.id}
            />
          ))
        )}
      </div>
    </div>
  );
};
