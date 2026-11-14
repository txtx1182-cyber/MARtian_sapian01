import { create } from "zustand";
import type { ObjectiveId } from "../lib/constants";

export interface EvaSettings {
  anchorId: string;
  speedKmh: number;
  durationH: number;
  siteWorkH: number;
  stops: number;
  stopMin: number;
}

export interface AppState {
  objective: ObjectiveId;
  selectedTargetId: string | null;
  hoveredTargetId: string | null;
  routeMode: boolean;
  evaMode: boolean;
  environmentOpen: boolean;
  aboutOpen: boolean;
  activeDetailTab: "why" | "access" | "views" | "sources";
  mobileRailOpen: boolean;
  mobileSheetOpen: boolean;
  searchQuery: string;

  evaSettings: EvaSettings;

  layers: {
    basemap: boolean;
    geologic: boolean;
    slope: boolean;
    traverse: boolean;
    route: boolean;
    targets: boolean;
    evaRadius: boolean;
  };

  selectTarget: (id: string | null) => void;
  setHoveredTarget: (id: string | null) => void;
  setObjective: (o: ObjectiveId) => void;
  toggleRoute: () => void;
  setRouteMode: (enabled: boolean) => void;
  toggleEvaMode: () => void;
  setEvaMode: (enabled: boolean) => void;
  updateEvaSettings: (settings: Partial<EvaSettings>) => void;
  toggleLayer: (id: keyof AppState["layers"]) => void;
  setLayerVisibility: (id: keyof AppState["layers"], visible: boolean) => void;
  openEnvironment: (open: boolean) => void;
  openAbout: (open: boolean) => void;
  setActiveDetailTab: (tab: "why" | "access" | "views" | "sources") => void;
  setMobileRailOpen: (open: boolean) => void;
  setMobileSheetOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  objective: "geological",
  selectedTargetId: null,
  hoveredTargetId: null,
  routeMode: false,
  evaMode: false,
  environmentOpen: false,
  aboutOpen: false,
  activeDetailTab: "why",
  mobileRailOpen: false,
  mobileSheetOpen: false,
  searchQuery: "",

  evaSettings: {
    anchorId: "T1",
    speedKmh: 1.5,
    durationH: 4.0,
    siteWorkH: 0.0,
    stops: 0,
    stopMin: 10
  },

  layers: {
    basemap: true,
    geologic: false,
    slope: false,
    traverse: true,
    route: false,
    targets: true,
    evaRadius: false
  },

  selectTarget: (id) =>
    set((state) => ({
      selectedTargetId: id,
      mobileSheetOpen: id !== null ? true : state.mobileSheetOpen
    })),

  setHoveredTarget: (id) => set({ hoveredTargetId: id }),

  setObjective: (o) => set({ objective: o }),

  toggleRoute: () =>
    set((state) => {
      const nextRouteMode = !state.routeMode;
      return {
        routeMode: nextRouteMode,
        selectedTargetId: nextRouteMode ? null : state.selectedTargetId,
        layers: {
          ...state.layers,
          route: nextRouteMode
        }
      };
    }),

  setRouteMode: (enabled) =>
    set((state) => ({
      routeMode: enabled,
      selectedTargetId: enabled ? null : state.selectedTargetId,
      layers: {
        ...state.layers,
        route: enabled
      }
    })),

  toggleEvaMode: () =>
    set((state) => {
      const nextEva = !state.evaMode;
      return {
        evaMode: nextEva,
        selectedTargetId: nextEva ? null : state.selectedTargetId,
        layers: {
          ...state.layers,
          evaRadius: nextEva
        }
      };
    }),

  setEvaMode: (enabled) =>
    set((state) => ({
      evaMode: enabled,
      layers: {
        ...state.layers,
        evaRadius: enabled
      }
    })),

  updateEvaSettings: (settings) =>
    set((state) => ({
      evaSettings: {
        ...state.evaSettings,
        ...settings
      }
    })),

  toggleLayer: (id) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [id]: !state.layers[id]
      }
    })),

  setLayerVisibility: (id, visible) =>
    set((state) => ({
      layers: {
        ...state.layers,
        [id]: visible
      }
    })),

  openEnvironment: (open) => set({ environmentOpen: open }),

  openAbout: (open) => set({ aboutOpen: open }),

  setActiveDetailTab: (tab) => set({ activeDetailTab: tab }),

  setMobileRailOpen: (open) => set({ mobileRailOpen: open }),

  setMobileSheetOpen: (open) => set({ mobileSheetOpen: open }),

  setSearchQuery: (searchQuery) => set({ searchQuery })
}));
