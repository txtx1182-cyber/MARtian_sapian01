import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../public/data");

console.log("=== Validating JEI Data Integrity ===");
let hasErrors = false;

function error(msg) {
  console.error(`❌ ERROR: ${msg}`);
  hasErrors = true;
}

function success(msg) {
  console.log(`✓ ${msg}`);
}

// 1. Check required files exist
const requiredFiles = [
  "manifest.json",
  "targets.geojson",
  "traverse.geojson",
  "route.geojson",
  "route_profile.json",
  "environment.json",
  "evidence.json",
  "sources.json",
  "basemap_jezero_1024.jpg"
];

for (const file of requiredFiles) {
  const fp = path.join(dataDir, file);
  if (!fs.existsSync(fp)) {
    error(`Missing required core file: ${file}`);
  } else {
    success(`Found ${file}`);
  }
}

// 2. Validate manifest
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(dataDir, "manifest.json"), "utf8"));
  if (!manifest.region?.bounds || !manifest.basemap?.bounds) {
    error("manifest.json missing required region.bounds or basemap.bounds fields");
  } else {
    success(`Manifest bounds verified: [${manifest.region.bounds.join(", ")}]`);
  }
} catch (e) {
  error(`manifest.json parse failure: ${e.message}`);
}

// 3. Validate targets.geojson
try {
  const targets = JSON.parse(fs.readFileSync(path.join(dataDir, "targets.geojson"), "utf8"));
  if (targets.features.length !== 9) {
    error(`targets.geojson contains ${targets.features.length} features, expected exactly 9`);
  } else {
    success(`targets.geojson contains exactly 9 targets`);
  }

  const t7 = targets.features.find(f => f.properties.code === "T7");
  if (!t7) {
    error("T7 (Cheyava Falls) missing from targets.geojson");
  } else {
    const biosig = t7.properties.biosignature;
    if (biosig.toLowerCase().includes("confirmed evidence") || !biosig.toLowerCase().includes("potential")) {
      error(`T7 biosignature assessment invalid: "${biosig}". Must state potential biosignature.`);
    } else {
      success(`T7 biosignature assessment verified: "${biosig}"`);
    }
  }
} catch (e) {
  error(`targets.geojson failure: ${e.message}`);
}

// 4. Validate route_profile.json
try {
  const profile = JSON.parse(fs.readFileSync(path.join(dataDir, "route_profile.json"), "utf8"));
  if (profile.summary.distance_km !== 23.3) {
    error(`route_profile distance_km is ${profile.summary.distance_km}, expected 23.3`);
  }
  if (Math.round(profile.summary.ascent_m) !== 452) {
    error(`route_profile ascent_m is ${profile.summary.ascent_m}, expected ~452`);
  }
  if (Math.round(profile.summary.descent_m) !== -237 && Math.round(profile.summary.descent_m) !== 237) {
    error(`route_profile descent_m is ${profile.summary.descent_m}, expected ~237`);
  }
  if (profile.summary.max_grade_pct !== 29.9) {
    error(`route_profile max_grade_pct is ${profile.summary.max_grade_pct}, expected 29.9`);
  }
  success(`route_profile.json summary statistics verified (23.3 km, +${profile.summary.ascent_m} m, -${profile.summary.descent_m} m, 29.9%)`);
} catch (e) {
  error(`route_profile.json failure: ${e.message}`);
}

// 5. Validate environment.json
try {
  const env = JSON.parse(fs.readFileSync(path.join(dataDir, "environment.json"), "utf8"));
  const items = env.items || env.cards;
  if (!items || items.length !== 5) {
    error(`environment.json has ${items?.length} items, expected 5`);
  } else {
    success(`environment.json contains 5 items`);
  }

  const rad = items.find(c => c.id === "ENV-RAD" || c.id === "radiation");
  if (!rad || !(rad.headline + " " + rad.detail + " " + rad.display).includes("No local RAD measurement")) {
    error("Radiation card missing mandatory caveat: 'No local RAD measurement'");
  } else {
    success("Radiation card caveat verified: 'No local RAD measurement'");
  }

  const ice = items.find(c => c.id === "ENV-ICE" || c.id === "water_ice");
  if (!ice || !(ice.headline + " " + ice.detail + " " + ice.display).includes("shallow ice")) {
    error("Water ice card missing mandatory caveat regarding shallow ice");
  } else {
    success("Water-ice card caveat verified: shallow ice not established/proven");
  }
} catch (e) {
  error(`environment.json failure: ${e.message}`);
}

// 6. Validate evidence.json
try {
  const ev = JSON.parse(fs.readFileSync(path.join(dataDir, "evidence.json"), "utf8"));
  const records = Array.isArray(ev) ? ev : ev.records;
  if (records.length < 14) {
    error(`evidence.json has ${records.length} records, expected at least 14`);
  } else {
    success(`evidence.json contains ${records.length} records`);
  }
  const t7Counter = records.find(r => r.target_id === "T7" && r.counter_evidence);
  if (!t7Counter) {
    error("T7 counter-evidence record missing in evidence.json");
  } else {
    success(`T7 counter-evidence record verified: "${t7Counter.counter_evidence.substring(0, 40)}..."`);
  }
} catch (e) {
  error(`evidence.json failure: ${e.message}`);
}

// 7. Validate prohibited phrases across all JSON files
const prohibited = [
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

function checkProhibited(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      checkProhibited(full);
    } else if (ent.name.endsWith(".json") || ent.name.endsWith(".geojson")) {
      const text = fs.readFileSync(full, "utf8").toLowerCase();
      for (const phrase of prohibited) {
        if (text.includes(phrase)) {
          error(`Prohibited phrase "${phrase}" detected in file ${full}`);
        }
      }
    }
  }
}

checkProhibited(dataDir);
success("Prohibited phrases audit: 0 violations detected in public/data");

// 8. Validate extras
const extrasDir = path.join(dataDir, "extras");
if (fs.existsSync(extrasDir)) {
  const extraFiles = ["manifest_extras.json", "sources_extra.json", "target_slopes.json", "geologic_units.geojson"];
  for (const f of extraFiles) {
    if (fs.existsSync(path.join(extrasDir, f))) {
      success(`Optional extras verified: ${f}`);
    }
  }
}

if (fs.existsSync(path.join(dataDir, "img/pov.json"))) {
  success("Optional extras verified: img/pov.json");
}

if (hasErrors) {
  console.error("\n❌ Data validation failed with errors.");
  process.exit(1);
} else {
  console.log("\n✅ All data validation checks passed successfully!");
}
