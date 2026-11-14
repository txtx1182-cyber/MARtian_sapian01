import { z } from "zod";

export const ManifestSchema = z.object({
  schemaVersion: z.string(),
  app: z.object({
    name: z.string(),
    shortName: z.string(),
    version: z.string()
  }),
  region: z.object({
    name: z.string(),
    bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    center: z.tuple([z.number(), z.number()]),
    crs: z.string(),
    note: z.string().optional()
  }),
  basemap: z.object({
    kind: z.string(),
    image: z.string(),
    bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]),
    alignment: z.enum(["approximate", "verified"]).or(z.string()),
    resolution_m: z.number(),
    source: z.string(),
    sourceUrl: z.string().optional(),
    fullResolution: z
      .object({
        url: z.string(),
        pixel_m: z.number(),
        size: z.string()
      })
      .optional(),
    warning: z.string()
  }),
  layers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      kind: z.string(),
      default: z.boolean()
    })
  ),
  targets: z.string(),
  traverse: z.string(),
  route: z.string(),
  routeProfile: z.string(),
  environment: z.string(),
  evidence: z.string(),
  sources: z.string()
});

export type Manifest = z.infer<typeof ManifestSchema>;

export const TargetPropertiesSchema = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  elevation_m: z.number(),
  unit: z.string(),
  context: z.string(),
  summary: z.string(),
  habitability: z.string(),
  biosignature: z.string(),
  science: z.string(),
  access: z.string(),
  confidence: z.string(),
  confidence_reason: z.string(),
  source_ids: z.array(z.string()),
  distance_from_landing_km: z.number(),
  nearest_rover_sol: z.number(),
  coordinate_note: z.string()
});

export type TargetProperties = z.infer<typeof TargetPropertiesSchema>;

export const TargetFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number(), z.number()]).or(z.tuple([z.number(), z.number()]))
  }),
  properties: TargetPropertiesSchema
});

export type TargetFeature = z.infer<typeof TargetFeatureSchema>;

export const TargetsGeoJSONSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(TargetFeatureSchema)
});

export type TargetsGeoJSON = z.infer<typeof TargetsGeoJSONSchema>;

export const TraverseFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("LineString"),
    coordinates: z.array(z.array(z.number()))
  }),
  properties: z.record(z.string(), z.unknown())
});

export const TraverseGeoJSONSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(TraverseFeatureSchema)
});

export type TraverseGeoJSON = z.infer<typeof TraverseGeoJSONSchema>;

export const RoutePropertiesSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.string(),
  start_target: z.string(),
  end_target: z.string(),
  waypoints: z.array(z.string()),
  distance_km: z.number(),
  ascent_m: z.number(),
  descent_m: z.number(),
  max_grade_pct: z.number(),
  min_grade_pct: z.number(),
  dem_source: z.string(),
  note: z.string()
});

export type RouteProperties = z.infer<typeof RoutePropertiesSchema>;

export const RouteFeatureSchema = z.object({
  type: z.literal("Feature"),
  geometry: z.object({
    type: z.literal("LineString"),
    coordinates: z.array(z.array(z.number()))
  }),
  properties: RoutePropertiesSchema
});

export const RouteGeoJSONSchema = z.object({
  type: z.literal("FeatureCollection"),
  features: z.array(RouteFeatureSchema)
});

export type RouteGeoJSON = z.infer<typeof RouteGeoJSONSchema>;

export const RouteProfileSchema = z.object({
  route_id: z.string(),
  summary: z.object({
    distance_km: z.number(),
    ascent_m: z.number(),
    descent_m: z.number(),
    max_grade_pct: z.number(),
    min_grade_pct: z.number(),
    elevation_min_m: z.number(),
    elevation_max_m: z.number()
  }),
  profile: z.array(
    z.object({
      distance_km: z.number(),
      elevation_m: z.number(),
      lat: z.number(),
      lon: z.number(),
      sol: z.number()
    })
  ),
  assumptions: z.array(z.string())
});

export type RouteProfile = z.infer<typeof RouteProfileSchema>;

export const EnvironmentItemSchema = z.object({
  id: z.string(),
  domain: z.enum(["Radiation", "Atmosphere", "Terrain", "Water ice", "Mobility"]).or(z.string()),
  kind: z.enum(["measured", "analogue", "model", "unknown", "assumption"]).or(z.string()),
  headline: z.string(),
  detail: z.string(),
  source_ids: z.array(z.string()),
  confidence: z.string(),
  display: z.string()
});

export type EnvironmentItem = z.infer<typeof EnvironmentItemSchema>;

export const EnvironmentDataSchema = z.object({
  items: z.array(EnvironmentItemSchema)
});

export type EnvironmentData = z.infer<typeof EnvironmentDataSchema>;

export const EvidenceRecordSchema = z.object({
  id: z.string(),
  target_id: z.string(),
  claim: z.string(),
  class: z.enum([
    "observation",
    "interpretation",
    "hypothesis",
    "public interpretation",
    "counter-evidence"
  ]).or(z.string()),
  instrument: z.string(),
  source_ids: z.array(z.string()),
  confidence: z.string(),
  supports: z.array(z.string()).optional(),
  counter_evidence: z.string(),
  what_would_change: z.string()
});

export type EvidenceRecord = z.infer<typeof EvidenceRecordSchema>;

export const EvidenceDataSchema = z.array(EvidenceRecordSchema);
export type EvidenceData = z.infer<typeof EvidenceDataSchema>;

export const SourceSchema = z.object({
  id: z.string(),
  citation: z.string(),
  url: z.string(),
  type: z.enum(["paper", "data", "map", "model", "public"]).or(z.string())
});

export type Source = z.infer<typeof SourceSchema>;

export const SourcesDataSchema = z.array(SourceSchema);
export type SourcesData = z.infer<typeof SourcesDataSchema>;

// === Extras schemas ===
export const ExtraLayerItemSchema = z.object({
  id: z.string(),
  path: z.string(),
  kind: z.string(),
  source: z.string(),
  product: z.string().optional(),
  method: z.string().optional(),
  bounds: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  note: z.string().optional()
});

export const ManifestExtrasSchema = z.object({
  schemaVersion: z.string(),
  layers: z.array(ExtraLayerItemSchema)
});

export type ManifestExtras = z.infer<typeof ManifestExtrasSchema>;

export const PovItemSchema = z.object({
  target_id: z.string(),
  image_id: z.string(),
  instrument: z.string(),
  sol: z.number(),
  caption: z.string(),
  credit: z.string(),
  source_url: z.string(),
  file: z.string(),
  alt: z.string()
});

export const PovDataSchema = z.array(PovItemSchema);
export type PovItem = z.infer<typeof PovItemSchema>;
export type PovData = z.infer<typeof PovDataSchema>;

export const TargetSlopeItemSchema = z.object({
  target_id: z.string(),
  median_slope_deg: z.number().nullable(),
  radius_m: z.number(),
  covered: z.boolean()
});

export const TargetSlopesSchema = z.array(TargetSlopeItemSchema);
export type TargetSlopeItem = z.infer<typeof TargetSlopeItemSchema>;
export type TargetSlopes = z.infer<typeof TargetSlopesSchema>;

export type AppData = {
  manifest: Manifest;
  targets: TargetsGeoJSON;
  traverse: TraverseGeoJSON;
  route: RouteGeoJSON;
  routeProfile: RouteProfile;
  environment: EnvironmentData;
  evidence: EvidenceData;
  sources: SourcesData;
  extrasManifest?: ManifestExtras | null;
  extraSources?: SourcesData;
  pov?: PovData;
  targetSlopes?: TargetSlopes;
  geologicUnits?: any;
};
