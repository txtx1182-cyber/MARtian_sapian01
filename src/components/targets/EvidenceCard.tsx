import React from "react";
import type { EvidenceRecord, Source } from "../../lib/schemas";
import { Badge } from "../common/Badge";
import { SourceLink } from "./SourceLink";
import { AlertCircle, HelpCircle } from "lucide-react";
import clsx from "clsx";

interface EvidenceCardProps {
  evidence: EvidenceRecord;
  allSources: Source[];
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, allSources }) => {
  const isCounterEvidence = evidence.class === "counter-evidence";

  return (
    <div
      className={clsx(
        "p-4 rounded-xl border space-y-3 transition-colors",
        isCounterEvidence
          ? "bg-danger-soft/40 border-danger/40 border-l-4"
          : "bg-surface-2/70 border-border"
      )}
    >
      {/* Header: Class Badge, Instrument, Confidence */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Badge variant={evidence.class}>{evidence.class}</Badge>
          <span className="text-[11px] font-mono text-dim truncate max-w-[200px]" title={evidence.instrument}>
            {evidence.instrument}
          </span>
        </div>
        <span className="text-[11px] font-mono text-muted">
          Confidence: <strong className="text-text">{evidence.confidence}</strong>
        </span>
      </div>

      {/* Primary Claim */}
      <p className="text-sm font-medium text-text leading-relaxed">{evidence.claim}</p>

      {/* Counter-Evidence (Visible by default, red left border) */}
      {evidence.counter_evidence && evidence.counter_evidence !== "None material." && (
        <div className="p-3 rounded-lg bg-danger-soft/60 border-l-4 border-danger space-y-1">
          <div className="flex items-center gap-1.5 text-danger font-semibold text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Counter-evidence / Limitations</span>
          </div>
          <p className="text-xs text-text/90 leading-relaxed">
            {evidence.counter_evidence}
          </p>
        </div>
      )}

      {/* What would change this */}
      {evidence.what_would_change && (
        <div className="p-2.5 rounded-lg bg-surface/80 border border-border space-y-1">
          <div className="flex items-center gap-1.5 text-dim font-mono text-[11px]">
            <HelpCircle className="w-3 h-3 text-accent" />
            <span>What would change this assessment?</span>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            {evidence.what_would_change}
          </p>
        </div>
      )}

      {/* Sources */}
      <SourceLink sourceIds={evidence.source_ids} allSources={allSources} />
    </div>
  );
};
