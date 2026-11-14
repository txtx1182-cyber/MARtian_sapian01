import React, { useEffect, useRef, useState, useMemo } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { AppData } from "../../lib/schemas";
import { useAppStore } from "../../store/useAppStore";
import { OBJECTIVES } from "../../lib/constants";
import { dataUrl } from "../../lib/data";
import { walkBackRadiusKm, createEvaCircleCoordinates } from "../../lib/eva";
import { MapScaleBar } from "./MapScaleBar";

interface MapViewProps {
  appData: AppData;
}

export const MapView: React.FC<MapViewProps> = ({ appData }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const isLoadedRef = useRef(false);
  const [currentZoom, setCurrentZoom] = useState(10.5);

  const {
    selectedTargetId,
    hoveredTargetId,
    selectTarget,
    setHoveredTarget,
    objective,
    routeMode,
    evaMode,
    evaSettings,
    layers
  } = useAppStore();

  const currentObjConfig = OBJECTIVES.find((o) => o.id === objective) ?? OBJECTIVES[0];

  // Derive basemap corners dynamically from manifest.basemap.bounds [w, s, e, n]
  // Corners order: [[top-left (w, n)], [top-right (e, n)], [bottom-right (e, s)], [bottom-left (w, s)]]
  const basemapCorners = useMemo<[[number, number], [number, number], [number, number], [number, number]]>(() => {
    const [w, s, e, n] = appData.manifest.basemap.bounds;
    return [
      [w, n],
      [e, n],
      [e, s],
      [w, s]
    ];
  }, [appData.manifest.basemap.bounds]);

  // Find anchor target for EVA circle
  const anchorTarget = appData.targets.features.find((t) => t.properties.id === evaSettings.anchorId) ?? appData.targets.features[0];
  const [anchorLon, anchorLat] = anchorTarget.geometry.coordinates;

  // Compute walk-back radius
  const radiusKm = walkBackRadiusKm(
    evaSettings.speedKmh,
    evaSettings.durationH,
    evaSettings.siteWorkH,
    evaSettings.stops,
    evaSettings.stopMin
  );

  // EVA circle GeoJSON
  const evaCircleGeoJson = useMemo(() => {
    const coords = createEvaCircleCoordinates(anchorLon, anchorLat, radiusKm, 64);
    return {
      type: "Feature" as const,
      geometry: {
        type: "Polygon" as const,
        coordinates: [coords]
      },
      properties: {}
    };
  }, [anchorLon, anchorLat, radiusKm]);

  // Selected target for EVA dashed tie line
  const activeTargetId = selectedTargetId ?? "T7";
  const activeTarget = appData.targets.features.find((t) => t.properties.id === activeTargetId) ?? appData.targets.features[0];
  const [targetLon, targetLat] = activeTarget.geometry.coordinates;

  const evaTieLineGeoJson = useMemo(() => {
    return {
      type: "Feature" as const,
      geometry: {
        type: "LineString" as const,
        coordinates: [
          [anchorLon, anchorLat],
          [targetLon, targetLat]
        ]
      },
      properties: {}
    };
  }, [anchorLon, anchorLat, targetLon, targetLat]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const bounds = appData.manifest.region.bounds; // [77.22, 18.405, 77.48, 18.515]

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          basemap: {
            type: "image",
            url: dataUrl(appData.manifest.basemap.image),
            coordinates: basemapCorners
          },
          targets: {
            type: "geojson",
            data: appData.targets,
            promoteId: "id"
          },
          traverse: {
            type: "geojson",
            data: appData.traverse
          },
          route: {
            type: "geojson",
            data: appData.route
          },
          "eva-circle": {
            type: "geojson",
            data: evaCircleGeoJson
          },
          "eva-line": {
            type: "geojson",
            data: evaTieLineGeoJson
          },
          ...(appData.geologicUnits
            ? {
                "geologic-units": {
                  type: "geojson",
                  data: appData.geologicUnits
                }
              }
            : {})
        },
        layers: [
          {
            id: "background",
            type: "background",
            paint: {
              "background-color": "#0B0F14"
            }
          },
          {
            id: "basemap",
            type: "raster",
            source: "basemap",
            paint: {
              "raster-opacity": 0.88
            }
          },
          // Geologic units layer (if present)
          ...(appData.geologicUnits
            ? [
                {
                  id: "geologic-units-fill",
                  type: "fill" as const,
                  source: "geologic-units",
                  layout: { visibility: "none" as const },
                  paint: {
                    // MapLibre GL expression typing: dynamic coalesce color fallback
                    "fill-color": ["coalesce", ["get", "color"], "#4A5568"] as any,
                    "fill-opacity": 0.28
                  }
                },
                {
                  id: "geologic-units-line",
                  type: "line" as const,
                  source: "geologic-units",
                  layout: { visibility: "none" as const },
                  paint: {
                    // MapLibre GL expression typing: dynamic coalesce color fallback
                    "line-color": ["coalesce", ["get", "color"], "#A0AEC0"] as any,
                    "line-width": 1.2,
                    "line-opacity": 0.65
                  }
                }
              ]
            : []),
          {
            id: "traverse",
            type: "line",
            source: "traverse",
            paint: {
              "line-color": "#5CC8D7",
              "line-width": 1.8,
              "line-dasharray": [2, 2],
              "line-opacity": 0.65
            }
          },
          {
            id: "route-casing",
            type: "line",
            source: "route",
            layout: {
              visibility: "none",
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": "#0B0F14",
              "line-width": 5.5,
              "line-opacity": 0.95
            }
          },
          {
            id: "route",
            type: "line",
            source: "route",
            layout: {
              visibility: "none",
              "line-join": "round",
              "line-cap": "round"
            },
            paint: {
              "line-color": "#F2A33A",
              "line-width": 3,
              "line-opacity": 0.95
            }
          },
          // EVA Sortie Radius Layers
          {
            id: "eva-circle-fill",
            type: "fill",
            source: "eva-circle",
            layout: { visibility: "none" },
            paint: {
              "fill-color": "#F2A33A",
              "fill-opacity": 0.08
            }
          },
          {
            id: "eva-circle-line",
            type: "line",
            source: "eva-circle",
            layout: { visibility: "none" },
            paint: {
              "line-color": "#F2A33A",
              "line-width": 2,
              "line-dasharray": [3, 3],
              "line-opacity": 0.85
            }
          },
          {
            id: "eva-tie-line",
            type: "line",
            source: "eva-line",
            layout: { visibility: "none" },
            paint: {
              "line-color": "#F2A33A",
              "line-width": 1.8,
              "line-dasharray": [2, 2],
              "line-opacity": 0.75
            }
          },
          {
            id: "targets-selected-ring",
            type: "circle",
            source: "targets",
            paint: {
              "circle-radius": 16,
              "circle-color": "transparent",
              "circle-stroke-width": 2.5,
              "circle-stroke-color": "#F2A33A"
            },
            filter: ["==", ["get", "id"], ""]
          },
          {
            id: "targets-hover-ring",
            type: "circle",
            source: "targets",
            paint: {
              "circle-radius": 13,
              "circle-color": "transparent",
              "circle-stroke-width": 1.5,
              "circle-stroke-color": "#5CC8D7"
            },
            filter: ["==", ["get", "id"], ""]
          },
          {
            id: "targets-circle",
            type: "circle",
            source: "targets",
            paint: {
              "circle-radius": 9,
              "circle-color": "#0B0F14",
              "circle-stroke-width": 2.5,
              "circle-stroke-color": currentObjConfig.ringColor
            }
          },
          // Decluttered labels with T6 and T7 offset in opposite directions
          {
            id: "targets-labels",
            type: "symbol",
            source: "targets",
            layout: {
              // MapLibre GL expression: feature target code label
              "text-field": ["get", "code"] as any,
              "text-size": 11,
              // MapLibre GL expression: collision avoidance offset for T6/T7
              "text-offset": [
                "case",
                ["==", ["get", "code"], "T6"],
                ["literal", [-1.4, -0.6]],
                ["==", ["get", "code"], "T7"],
                ["literal", [1.4, 0.6]],
                ["literal", [0, 1.3]]
              ] as any,
              "text-anchor": "top",
              "text-allow-overlap": true
            },
            paint: {
              "text-color": "#FFFFFF",
              "text-halo-color": "#0B0F14",
              "text-halo-width": 2
            }
          }
        ]
      },
      bounds: bounds as [number, number, number, number],
      fitBoundsOptions: { padding: { top: 40, bottom: 40, left: 60, right: 40 } },
      maxBounds: [77.14, 18.32, 77.64, 18.58],
      minZoom: 8.5,
      maxZoom: 14,
      attributionControl: false
    });

    // Navigation control (compass & zoom only, NO built-in Earth ScaleControl)
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), "bottom-right");

    map.on("load", () => {
      isLoadedRef.current = true;
      setCurrentZoom(map.getZoom());
    });

    map.on("zoom", () => {
      setCurrentZoom(map.getZoom());
    });

    // Click target
    map.on("click", "targets-circle", (e: maplibregl.MapLayerMouseEvent) => {
      const feat = e.features?.[0];
      if (feat && feat.properties?.id) {
        selectTarget(feat.properties.id);
      }
    });

    // Click background clears selection
    map.on("click", (e: maplibregl.MapMouseEvent) => {
      const bbox: [maplibregl.PointLike, maplibregl.PointLike] = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.y + 5, e.point.y + 5]
      ];
      const features = map.queryRenderedFeatures(bbox, { layers: ["targets-circle"] });
      if (features.length === 0) {
        selectTarget(null);
      }
    });

    // Hover cursor
    map.on("mouseenter", "targets-circle", (e: maplibregl.MapLayerMouseEvent) => {
      map.getCanvas().style.cursor = "pointer";
      const feat = e.features?.[0];
      if (feat && feat.properties?.id) {
        setHoveredTarget(feat.properties.id);
      }
    });

    map.on("mouseleave", "targets-circle", () => {
      map.getCanvas().style.cursor = "";
      setHoveredTarget(null);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      isLoadedRef.current = false;
    };
  }, [appData, basemapCorners]);

  // Update selection & hover rings
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    if (map.getLayer("targets-selected-ring")) {
      map.setFilter("targets-selected-ring", ["==", ["get", "id"], selectedTargetId || ""]);
    }
  }, [selectedTargetId]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    if (map.getLayer("targets-hover-ring")) {
      map.setFilter("targets-hover-ring", ["==", ["get", "id"], hoveredTargetId || ""]);
    }
  }, [hoveredTargetId]);

  // Update objective ring colors
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    if (map.getLayer("targets-circle")) {
      map.setPaintProperty("targets-circle", "circle-stroke-color", currentObjConfig.ringColor);
    }
  }, [objective, currentObjConfig]);

  // Update EVA Circle and Line Data
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    const circleSource = map.getSource("eva-circle") as maplibregl.GeoJSONSource | undefined;
    if (circleSource) {
      circleSource.setData(evaCircleGeoJson as any);
    }

    const lineSource = map.getSource("eva-line") as maplibregl.GeoJSONSource | undefined;
    if (lineSource) {
      lineSource.setData(evaTieLineGeoJson as any);
    }
  }, [evaCircleGeoJson, evaTieLineGeoJson]);

  // Update layer visibility: basemap, traverse, route, eva, geologic
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isLoadedRef.current) return;

    if (map.getLayer("basemap")) {
      map.setLayoutProperty("basemap", "visibility", layers.basemap ? "visible" : "none");
    }
    if (map.getLayer("traverse")) {
      map.setLayoutProperty("traverse", "visibility", layers.traverse ? "visible" : "none");
    }
    if (map.getLayer("route")) {
      map.setLayoutProperty("route", "visibility", routeMode ? "visible" : "none");
    }
    if (map.getLayer("route-casing")) {
      map.setLayoutProperty("route-casing", "visibility", routeMode ? "visible" : "none");
    }

    const showEva = evaMode || layers.evaRadius;
    if (map.getLayer("eva-circle-fill")) {
      map.setLayoutProperty("eva-circle-fill", "visibility", showEva ? "visible" : "none");
    }
    if (map.getLayer("eva-circle-line")) {
      map.setLayoutProperty("eva-circle-line", "visibility", showEva ? "visible" : "none");
    }
    if (map.getLayer("eva-tie-line")) {
      map.setLayoutProperty("eva-tie-line", "visibility", showEva && selectedTargetId ? "visible" : "none");
    }

    if (map.getLayer("geologic-units-fill")) {
      map.setLayoutProperty("geologic-units-fill", "visibility", layers.geologic ? "visible" : "none");
    }
    if (map.getLayer("geologic-units-line")) {
      map.setLayoutProperty("geologic-units-line", "visibility", layers.geologic ? "visible" : "none");
    }
  }, [layers, routeMode, evaMode, selectedTargetId]);

  // Camera FlyTo on Target Selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedTargetId) return;

    const target = appData.targets.features.find((t) => t.properties.id === selectedTargetId);
    if (!target) return;

    const [lon, lat] = target.geometry.coordinates;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      map.jumpTo({ center: [lon, lat], zoom: 12 });
    } else {
      map.flyTo({
        center: [lon, lat],
        zoom: 12,
        duration: 550
      });
    }
  }, [selectedTargetId, appData.targets]);

  // Fit Bounds on Route Mode Toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !routeMode) return;

    map.fitBounds(
      [
        [77.29, 18.42],
        [77.47, 18.51]
      ],
      { padding: 50, duration: 600 }
    );
  }, [routeMode]);

  return (
    <div className="relative w-full h-full bg-bg overflow-hidden">
      <div
        ref={mapContainer}
        className="w-full h-full"
        role="region"
        aria-label="Jezero Crater science map. Use the target list for accessible navigation."
      />

      {/* Custom Mars 2000 Scale Bar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
        <MapScaleBar zoom={currentZoom} latitude={18.45} />
      </div>
    </div>
  );
};
