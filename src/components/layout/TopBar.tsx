import React from "react";
import { Compass, Info, CloudSun, Route, Menu, Footprints } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { OBJECTIVES, APP_NAME, APP_SHORT_NAME, APP_SUBTITLE } from "../../lib/constants";
import clsx from "clsx";

export const TopBar: React.FC = () => {
  const {
    objective,
    setObjective,
    routeMode,
    toggleRoute,
    evaMode,
    toggleEvaMode,
    openEnvironment,
    openAbout,
    mobileRailOpen,
    setMobileRailOpen
  } = useAppStore();

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 z-30 select-none">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileRailOpen(!mobileRailOpen)}
          aria-label="Toggle targets menu"
          className="lg:hidden p-1.5 rounded-lg text-muted hover:text-text hover:bg-surface-2"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-accent-soft border border-accent/40 flex items-center justify-center text-accent">
            <Compass className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-sm tracking-wide text-text">
                {APP_SHORT_NAME}
              </span>
              <span className="text-dim text-xs font-mono hidden sm:inline">·</span>
              <span className="text-xs text-muted font-medium hidden sm:inline">
                {APP_NAME}
              </span>
            </div>
            <span className="text-[10px] text-dim font-mono hidden xl:inline leading-none">
              {APP_SUBTITLE}
            </span>
          </div>
        </div>
      </div>

      {/* Center: Objective Selector */}
      <div className="hidden md:flex items-center bg-bg/80 border border-border p-1 rounded-lg">
        <div role="radiogroup" aria-label="Science objective" className="flex items-center gap-1">
          {OBJECTIVES.map((obj) => {
            const isActive = objective === obj.id;
            return (
              <button
                key={obj.id}
                role="radio"
                aria-checked={isActive}
                onClick={() => setObjective(obj.id)}
                className={clsx(
                  "px-3 py-1 text-xs font-medium rounded transition-all relative",
                  isActive
                    ? "text-text bg-surface-2 shadow-sm font-semibold"
                    : "text-muted hover:text-text hover:bg-surface-2/40"
                )}
              >
                <span>{obj.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-accent rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Objective Selector Dropdown */}
      <div className="md:hidden flex items-center">
        <label htmlFor="mobile-objective-select" className="sr-only">Objective</label>
        <select
          id="mobile-objective-select"
          value={objective}
          onChange={(e) => setObjective(e.target.value as any)}
          className="bg-bg text-text border border-border rounded px-2 py-1 text-xs focus:ring-1 focus:ring-accent outline-none"
        >
          {OBJECTIVES.map((obj) => (
            <option key={obj.id} value={obj.id}>
              {obj.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right Actions: EVA Toggle, Route Toggle, Environment, About */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* EVA Sortie Mode Toggle */}
        <button
          onClick={toggleEvaMode}
          aria-pressed={evaMode}
          className={clsx(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            evaMode
              ? "bg-accent-soft text-accent border-accent/50 shadow-sm"
              : "bg-surface-2 text-muted border-border hover:text-text hover:bg-surface-2/80"
          )}
          title="Toggle EVA Sortie operational walk-back radius"
        >
          <Footprints className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">EVA Sortie</span>
          <span
            className={clsx(
              "w-2 h-2 rounded-full",
              evaMode ? "bg-accent animate-ping" : "bg-dim"
            )}
          />
        </button>

        {/* Route Toggle Switch */}
        <button
          onClick={toggleRoute}
          aria-pressed={routeMode}
          className={clsx(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            routeMode
              ? "bg-cyan-soft text-cyan border-cyan/50 shadow-sm"
              : "bg-surface-2 text-muted border-border hover:text-text hover:bg-surface-2/80"
          )}
          title="Toggle Rover Science Traverse R1"
        >
          <Route className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Route R1</span>
          <span
            className={clsx(
              "w-2 h-2 rounded-full",
              routeMode ? "bg-cyan animate-ping" : "bg-dim"
            )}
          />
        </button>

        {/* Environment Button */}
        <button
          onClick={() => openEnvironment(true)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-text bg-surface-2 hover:bg-surface-2/80 border border-border transition-colors"
          title="Environmental Context (Radiation, Atmosphere, Terrain, Ice, Mobility)"
        >
          <CloudSun className="w-3.5 h-3.5 text-cyan" />
          <span className="hidden md:inline">Env</span>
        </button>

        {/* About Button */}
        <button
          onClick={() => openAbout(true)}
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-text bg-surface-2 hover:bg-surface-2/80 border border-border transition-colors"
          title="About JEI, Scientific Methodology, and Data Sources"
        >
          <Info className="w-3.5 h-3.5 text-violet" />
          <span className="hidden md:inline">About</span>
        </button>
      </div>
    </header>
  );
};
