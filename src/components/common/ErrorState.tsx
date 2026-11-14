import React from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 bg-bg text-text">
      <div className="max-w-md w-full bg-surface border border-danger/40 rounded-xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center gap-3 text-danger">
          <div className="p-2 bg-danger-soft rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-display font-semibold">Data Could Not Be Loaded</h1>
            <p className="text-xs text-muted">Jezero static dataset verification failed</p>
          </div>
        </div>

        <div className="p-3 bg-bg rounded-lg border border-border text-xs font-mono text-danger break-words">
          {error}
        </div>

        <p className="text-xs text-muted leading-relaxed">
          The app strictly validates scientific data before rendering to avoid fabricating or
          substituting unverified values. Verify the static files in{" "}
          <code className="text-accent font-mono">public/data/</code>.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-accent text-bg font-semibold text-xs rounded-lg hover:bg-accent/90 transition-colors focus:ring-2 focus:ring-accent"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    </div>
  );
};
