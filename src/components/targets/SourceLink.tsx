import React from "react";
import type { Source } from "../../lib/schemas";
import { ExternalLink, BookOpen } from "lucide-react";
import { Badge } from "../common/Badge";

interface SourceLinkProps {
  sourceIds: string[];
  allSources: Source[];
}

export const SourceLink: React.FC<SourceLinkProps> = ({ sourceIds, allSources }) => {
  if (!sourceIds || sourceIds.length === 0) return null;

  const matchedSources = sourceIds
    .map((id) => allSources.find((s) => s.id === id))
    .filter((s): s is Source => Boolean(s));

  if (matchedSources.length === 0) {
    return (
      <div className="text-[11px] font-mono text-dim">
        Sources: {sourceIds.join(", ")} (metadata not loaded)
      </div>
    );
  }

  return (
    <div className="space-y-1.5 pt-1">
      <div className="text-[11px] font-mono text-dim flex items-center gap-1">
        <BookOpen className="w-3 h-3 text-muted" />
        <span>Sources:</span>
      </div>
      <div className="space-y-1">
        {matchedSources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-2 p-2 rounded bg-surface border border-border hover:border-accent/40 text-[11px] text-muted hover:text-text transition-colors group"
          >
            <div className="flex-1 leading-snug">
              <span className="font-mono text-accent mr-1.5">[{source.id}]</span>
              <span className="text-text/90 group-hover:underline">{source.citation}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0 pt-0.5">
              <Badge variant={source.type}>{source.type}</Badge>
              <ExternalLink className="w-3 h-3 text-dim group-hover:text-accent" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
