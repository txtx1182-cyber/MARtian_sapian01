export const APP_NAME = "Jezero Expedition Intelligence";
export const APP_SHORT_NAME = "JEI";
export const APP_SUBTITLE = "An evidence-first EVA planning map for Jezero Crater.";
export const PRODUCT_SENTENCE = "An evidence-first EVA planning map for the first human Marswalk at Jezero.";
export const PLANNING_AID_COPY = "Planning aid, not a safety certification.";
export const NO_CONFIRMED_LIFE = "No confirmed evidence of Martian life.";

export const SCIENTIFIC_STATEMENT =
  "The strongest scientific statement the data support is: Jezero was habitable, and Bright Angel preserves a potential biosignature that requires sample return to resolve. That is not the same as evidence of life.";

export const STATUS_CRS = "Mars 2000 planetocentric · equirectangular · positive east";
export const STATUS_BASEMAP = "Basemap: USGS HiRISE browse · approximate alignment";
export const BASEMAP_TOOLTIP =
  "Basemap is a 1024 px browse image; use the full-resolution USGS GeoTIFF for scientific measurement.";

export const ROUTE_WARNING = "Rover traverse segment. Not a human-rated route.";
export const ROUTE_ELEVATION_NOTE = "Elevations from rover localization, not a HiRISE DTM.";
export const ROUTE_SPEED_NOTE = "No slope-dependent speed model has been applied.";
export const ROUTE_OBSTACLE_NOTE = "No obstacle, boulder, dust, or communications model has been applied.";

export const T7_BIOSIGNATURE_COPY = "Potential biosignature — not confirmed evidence of life.";
export const T7_OBSERVATION_CAVEAT =
  "The observations are compelling, but the biological interpretation is unresolved. Returned-sample analysis is required.";
export const T7_MINERAL_NOTE = "Likely vivianite and greigite (not confirmed).";
export const T7_COUNTER_EVIDENCE_COPY =
  "Counter-evidence: luminescence signals initially reported as consistent with organics can be explained by inorganic Ce³⁺ in phosphate and silicate defects.";

export const RADIATION_COPY =
  "No local RAD measurement at Jezero. MSL RAD measured Gale Crater. This is an analogue/model estimate, not a local measurement.";

export const WATER_ICE_COPY =
  "Ancient water is documented. Present-day shallow ice at Jezero is not established.";

// --- Patch additions ---
export const EVA_ASSUMPTIONS =
  "Design assumptions, not NASA-validated capabilities. Straight-line distance on a sphere, flat ground. No obstacle, slope, dust, suit, or communications model.";
export const EVA_ANCHOR_NOTE = "Notional anchor. Not a proposed landing or habitat site.";
export const SLOPE_NOTE =
  "Slope from HiRISE DTM, 5 m baseline. Not a trafficability model. Coverage is limited to DTM footprints.";
export const GEOLOGIC_NOTE =
  "USGS geologic map units. Context only. Documented 100 to 200 m offset from the surface-operations CTX mosaic.";
export const POV_NOTE = "Rover camera view. Not a suited-astronaut perspective.";
export const SAMPLE_STATUS =
  "Sample status: the Sapphire Canyon core remains stored on Mars. NASA's Mars Sample Return program was effectively cancelled in 2026 budget action and no replacement return mission has been announced. Resolving the biological question still depends on analysis in Earth laboratories.";

export const PROHIBITED_PHRASES = [
  "life on mars confirmed",
  "biosignature found",
  "proof of ancient life",
  "safe route",
  "hazard-free",
  "nasa-approved route",
  "guaranteed",
  "100% safe",
  "the map proves",
  "safe walk",
  "within safe range",
  "cleared",
  "go/no-go",
  "eva-ready",
  "hazard map",
  "trafficable"
];

export const OBJECTIVES = [
  { id: "geological", label: "Geological history", color: "#F2A33A", ringColor: "#F2A33A" },
  { id: "habitability", label: "Habitability", color: "#5CC8D7", ringColor: "#5CC8D7" },
  { id: "biosignature", label: "Biosignature", color: "#A78BFA", ringColor: "#A78BFA" },
  { id: "accessibility", label: "Accessibility", color: "#6FCF97", ringColor: "#6FCF97" }
] as const;

export type ObjectiveId = (typeof OBJECTIVES)[number]["id"];

export const ASSESSMENT_DEFINITIONS = {
  habitability: "Habitability potential — could the past environment have supported life?",
  biosignature: "Biosignature evidence — are observations consistent with biology, and how well are alternative explanations understood?",
  science: "Scientific value — could the target improve understanding of geological history, mineral formation, or environmental evolution?",
  access: "Accessibility — how difficult is it to reach and work at the target?"
} as const;

export const SPEC_BASEMAP_BOUNDS = {
  west: 77.22,
  east: 77.58,
  north: 18.55,
  south: 18.35
};
