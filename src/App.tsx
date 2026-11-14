import React, { useEffect, useState } from "react";
import type { AppData } from "./lib/schemas";
import { loadAppData } from "./lib/data";
import { TopBar } from "./components/layout/TopBar";
import { StatusBar } from "./components/layout/StatusBar";
import { LeftRail } from "./components/layout/LeftRail";
import { RightPanel } from "./components/layout/RightPanel";
import { MapView } from "./components/map/MapView";
import { EnvironmentDrawer } from "./components/environment/EnvironmentDrawer";
import { AboutDrawer } from "./components/about/AboutDrawer";
import { ErrorState } from "./components/common/ErrorState";
import { useAppStore } from "./store/useAppStore";
import { Compass } from "lucide-react";
import clsx from "clsx";

export const App: React.FC = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    mobileRailOpen,
    setMobileRailOpen,
    selectedTargetId,
    routeMode
  } = useAppStore();

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const appData = await loadAppData();
      setData(appData);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (error) {
    return <ErrorState error={error} onRetry={loadData} />;
  }

  if (loading || !data) {
    return (
      <div className="h-screen w-screen flex flex-col bg-bg text-text select-none">
        <div className="h-14 border-b border-border bg-surface px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-accent font-display font-semibold">
            <Compass className="w-5 h-5 animate-spin" />
            <span>Jezero Expedition Intelligence</span>
          </div>
          <div className="h-5 w-48 bg-surface-2 animate-pulse rounded" />
        </div>
        <div className="flex-1 flex items-center justify-center bg-bg">
          <div className="text-center space-y-3">
            <div className="inline-flex p-3 rounded-xl bg-surface-2 border border-border text-accent">
              <Compass className="w-8 h-8 animate-spin" />
            </div>
            <div className="font-display font-bold text-base text-text">Loading Jezero data…</div>
            <div className="text-xs font-mono text-dim">
              Validating targets, rover telemetry, and scientific records
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-bg text-text overflow-hidden select-none font-body">
      {/* Top Navigation Bar */}
      <TopBar />

      {/* Main Workspace Body */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Left Rail (Desktop permanent 300px; Tablet/Mobile drawer) */}
        <div
          className={clsx(
            "fixed inset-y-14 left-0 z-40 w-80 lg:static lg:inset-auto lg:w-72 xl:w-80 shrink-0 transition-transform duration-200 lg:translate-x-0",
            mobileRailOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Backdrop on mobile */}
          {mobileRailOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-[-1] lg:hidden"
              onClick={() => setMobileRailOpen(false)}
            />
          )}
          <LeftRail targets={data.targets.features} evidenceRecords={data.evidence} />
        </div>

        {/* Center: MapView */}
        <main className="flex-1 h-full relative overflow-hidden">
          <MapView appData={data} />
        </main>

        {/* Right Panel (Desktop permanent 380px; Tablet/Mobile slide-in / sheet) */}
        <div
          className={clsx(
            "w-full sm:w-96 md:w-[380px] shrink-0 h-full transition-all duration-200 z-30",
            // On small mobile, if a target is selected or routeMode is on, display right panel; otherwise hide or overlay
            selectedTargetId || routeMode ? "block" : "hidden lg:block"
          )}
        >
          <RightPanel appData={data} />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <StatusBar />

      {/* Environmental Context Drawer */}
      <EnvironmentDrawer environmentData={data.environment} allSources={data.sources} />

      {/* About & Methodology Drawer */}
      <AboutDrawer />
    </div>
  );
};
