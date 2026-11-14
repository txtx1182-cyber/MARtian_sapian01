import {
  ManifestSchema,
  TargetsGeoJSONSchema,
  TraverseGeoJSONSchema,
  RouteGeoJSONSchema,
  RouteProfileSchema,
  EnvironmentDataSchema,
  EvidenceDataSchema,
  SourcesDataSchema,
  ManifestExtrasSchema,
  PovDataSchema,
  TargetSlopesSchema,
  type AppData,
  type ManifestExtras,
  type SourcesData,
  type PovData,
  type TargetSlopes
} from "./schemas";

export const dataUrl = (p: string): string => {
  // Strip leading slashes and any leading "data/" segment to avoid /data/data/...
  const clean = p.replace(/^\/+/, "").replace(/^data\//, "");
  return new URL(`${import.meta.env.BASE_URL}data/${clean}`, document.baseURI).toString();
};

async function fetchJSON<T>(url: string, schema: { parse: (val: unknown) => T }): Promise<T> {
  const resolved = url.startsWith("http://") || url.startsWith("https://") ? url : dataUrl(url);
  const res = await fetch(resolved);
  if (!res.ok) {
    throw new Error(`Failed to load ${resolved}: ${res.status} ${res.statusText}`);
  }
  const raw = await res.json();
  try {
    return schema.parse(raw);
  } catch (err) {
    console.error(`Validation failed for ${resolved}`, err);
    throw new Error(
      `Validation failed for ${resolved}: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

async function fetchOptionalJSON<T>(url: string, schema: { parse: (val: unknown) => T }): Promise<T | null> {
  try {
    return await fetchJSON(url, schema);
  } catch {
    return null;
  }
}

export async function loadAppData(): Promise<AppData> {
  const manifest = await fetchJSON("manifest.json", ManifestSchema);

  // Load core files using dataUrl
  const [targets, traverse, route, routeProfile, environment, evidence, sources] = await Promise.all([
    fetchJSON(manifest.targets, TargetsGeoJSONSchema),
    fetchJSON(manifest.traverse, TraverseGeoJSONSchema),
    fetchJSON(manifest.route, RouteGeoJSONSchema),
    fetchJSON(manifest.routeProfile, RouteProfileSchema),
    fetchJSON(manifest.environment, EnvironmentDataSchema),
    fetchJSON(manifest.evidence, EvidenceDataSchema),
    fetchJSON(manifest.sources, SourcesDataSchema)
  ]);

  // Load extras gracefully
  const extrasManifest: ManifestExtras | null = await fetchOptionalJSON(
    "extras/manifest_extras.json",
    ManifestExtrasSchema
  );

  const extraSources: SourcesData | null = await fetchOptionalJSON(
    "extras/sources_extra.json",
    SourcesDataSchema
  );

  const pov: PovData | null = await fetchOptionalJSON(
    "img/pov.json",
    PovDataSchema
  );

  const targetSlopes: TargetSlopes | null = await fetchOptionalJSON(
    "extras/target_slopes.json",
    TargetSlopesSchema
  );

  // Check if geologic units geojson is available
  let geologicUnits = null;
  try {
    const geoRes = await fetch(dataUrl("extras/geologic_units.geojson"));
    if (geoRes.ok) {
      geologicUnits = await geoRes.json();
    }
  } catch {
    geologicUnits = null;
  }

  // Combine primary sources with extraSources (e.g. news sources for sample status)
  const combinedSources = [...sources];
  if (extraSources) {
    for (const src of extraSources) {
      if (!combinedSources.some((s) => s.id === src.id)) {
        combinedSources.push(src);
      }
    }
  }

  return {
    manifest,
    targets,
    traverse,
    route,
    routeProfile,
    environment,
    evidence,
    sources: combinedSources,
    extrasManifest,
    extraSources: extraSources ?? [],
    pov: pov ?? [],
    targetSlopes: targetSlopes ?? [],
    geologicUnits
  };
}
