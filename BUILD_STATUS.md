# Jezero Expedition Intelligence (JEI) — Build & Audit Status

**NASA Space Apps Challenge 2026** — *Challenge 11: Interplanetary Survival Guide: Martian Map*  
**Repository:** [https://github.com/txtx1182-cyber/MARtian_sapian01](https://github.com/txtx1182-cyber/MARtian_sapian01)  
**Deployment Target:** Render Static Site (`render.yaml`)  
**Status Date:** November 2026

---

## 1. Environment & Tech Stack

| Component | Specification / Version | Verification |
|---|---|---|
| **OS** | Windows 11 Home / PowerShell | Verified |
| **Node.js** | v24.x | Verified |
| **Package Manager** | pnpm v12.18.0 (strict peer dependencies, frozen lockfile ready) | Verified |
| **Frontend Framework** | React 19.3.1 + TypeScript 7.0.2 (strict mode enabled) | Verified |
| **Build Tool** | Vite 6.2.0 (`es2020` target, static assets) | `tsc -b && vite build` passed (0 errors) |
| **Styling** | Tailwind CSS 3.4.17 + PostCSS + Autoprefixer | Verified |
| **Mapping Engine** | MapLibre GL 6.18.0 (Mars 2000 equirectangular sphere) | Verified |
| **State Management**| Zustand 5.1.0 | Verified |
| **Validation** | Zod 4.6.7 (strict data contracts for all GeoJSON/JSON) | Verified |
| **Test Framework** | Vitest 2.1.8 + Happy-DOM 15.11.7 + Testing Library | 17/17 tests passing |
| **E2E Testing** | Playwright 1.65.0 (Chromium) | Verified |

---

## 2. Real vs. Derived vs. Assumption Matrix

Every piece of data in Jezero Expedition Intelligence is strictly accounted for:

| Asset / Metric | Classification | Description / Lineage | Caveats & Integrity Safeguards |
|---|---|---|---|
| **Science Targets (T1–T9)** | **Real** | NASA Mars 2020 Perseverance Science Team published targets, coordinates, and geologic units. | Target locations and four core qualitative assessments are fixed from NASA publications. |
| **Rover Traverse (Sols 0–1897)** | **Real** | PDS daily drive positions (531 vertices, 37.27 km along-track). | Mars 2000 planetocentric coordinate frame. |
| **USGS HiRISE Basemap** | **Real** | USGS Astrogeology Mars 2020 TRN HiRISE orthomosaic browse (JEZ_hirise_soc_006). | Status bar explicitly caveats: *Approximate alignment · 20 m/px*. Full 25 cm orthomosaic linked. |
| **USGS SIM 3464 Geologic Units** | **Real** | Pre-landing USGS Scientific Investigations Map 3464 (Sun & Stack 2020). | Shown as contextual GIS overlay with explicit provenance. |
| **Evidence Records (14 records)** | **Real** | Peer-reviewed publications (Farley 2022, Scheller 2024, Stack 2020, Wiens 2022, etc.). | Counter-evidence (e.g. Ce³⁺ luminescence for Cheyava Falls) visible by default. |
| **Route R1 Coordinates & Distance**| **Real** | Fixed rover science traverse segment (23.3 km). | Non-negotiable warning: *Rover traverse segment. Not a human-rated route.* |
| **Route Elevation Profile** | **Derived** | Derived from HiRISE DTM sampling along the R1 path. | Gross ascent = +452.3 m; net rise = +215.4 m; max grade = 29.9%. |
| **Target Slopes (T1–T5)** | **Derived** | Local slope measurements from HiRISE DTM for landing and delta front. | T6–T9 outside high-res DTM footprint are marked `covered: false` ("No high-res DTM"). |
| **Along-Track Traverse Distances** | **Derived** | Computed from 531-point daily traverse track. | Identifies along-track distances: T8 = 28.29 km (sol 1400), T9 = 37.27 km (sol 1897). |
| **EVA Sortie Walk-Back Model** | **Assumption** | Operational planning model based on NASA EVA guidelines and metabolic walk-back physics. | Clearly badged: *Operational Planning Aid — Not a Certified Safety System*. |
| **Environmental Context** | **Mixed** | MEDA = Measured; RAD = Analogue/Model (Gale); Ice = Unknown; Mobility = Assumption. | Explicitly displays: *No local RAD measurement at Jezero* and *Shallow ice not established*. |

---

## 3. Route R1 Elevation Audit & Gross Ascent Reconciliation

Running `node scripts/audit-route.mjs` against `route_profile.json` reveals the exact terrain dynamics:

### Elevation Metrics
* **Elevation Min:** -2585.9 m
* **Elevation Max:** -2349.3 m
* **Start Elevation (T1 vicinity):** -2569.9 m
* **End Elevation (T7 / Bright Angel):** -2354.5 m
* **True Net Elevation Change:** **+215.4 m**

### Gross Ascent vs. Smoothing Filters
| Metric Baseline | Gross Ascent | Gross Descent | Discrepancy vs. Stored |
|---|---|---|---|
| **Stored Summary (`route_profile.json`)** | **452.3 m** | **236.8 m** | Baseline |
| **Raw 170-Point HiRISE Sampling** | 422.2 m | 206.8 m | -6.7% |
| **5-Point Moving Average (~500 m filter)** | **300.8 m** | **88.8 m** | **-33.5%** |
| **9-Point Moving Average (~900 m filter)** | 254.7 m | 44.0 m | -43.7% |

### Apparent Grade at Different Baselines
* **Stored Summary (finer micro-steps):** **29.9%** (min: -20.7%)
* **1-Point (~100 m baseline):** 24.0% (min: -17.4%)
* **3-Point (~300 m baseline):** 18.4% (min: -14.0%)
* **5-Point (~500 m baseline):** 9.5% (min: -5.6%)

### Reconciling Finding & Product Solution
The stored gross ascent of 452.3 m reflects high-frequency micro-topography (dune ripple fields and small boulder mounds) sampled by HiRISE. When smoothed with a 5-point moving average appropriate for human walk-back planning, gross climbing drops to 300.8 m (+215.4 m net climbing).  
**Product Implementation:** In `RoutePanel.tsx`, JEI displays the exact stored 452 m gross ascent to honor the provided data, and adds an educational disclosure:  
*“Micro-topography gross climbing: +452 m (smoothed human-scale grade baseline: ~301 m; net terrain rise: +215 m).”*

---

## 4. Target Distance Audit Findings (T8 & T9 Offsets)

Running `node scripts/audit-targets.mjs` against `targets.geojson` and `traverse.geojson` revealed:

| Target ID | Target Name | Stored Distance | Stored Sol | True Straight-Line | True Along-Track | True Nearest Sol | Status |
|---|---|---|---|---|---|---|---|
| **T1** | Octavia E. Butler Landing | 0.00 km | 0 | 0.00 km | 0.00 km | 0 | Exact match |
| **T2** | Séítah | 2.21 km | 200 | 0.92 km | 2.22 km | 200 | Exact match |
| **T3** | Máaz | 7.29 km | 400 | 1.32 km | 7.31 km | 400 | Exact match |
| **T4** | Western Delta Front | 16.47 km | 797 | 5.15 km | 16.50 km | 797 | Exact match |
| **T5** | Upper Delta | 19.80 km | 1000 | 6.59 km | 19.84 km | 1000 | Exact match |
| **T6** | Neretva Vallis Entry | 23.17 km | 1177 | 8.82 km | 23.21 km | 1177 | Exact match |
| **T7** | Bright Angel / Cheyava | 23.30 km | 1195 | 8.77 km | 23.34 km | 1195 | Exact match |
| **T8** | Margin Unit / Mandu Wall | 23.11 km *(offset)*| 1175 *(offset)*| 10.51 km | **28.29 km** | **1400** | **Propose correction** |
| **T9** | Western Rim Traverse | 23.11 km *(offset)*| 1175 *(offset)*| 13.01 km | **37.27 km** | **1897** | **Propose correction** |

### Root Cause
In the provided `targets.geojson`, T8 and T9 had placeholder distances copied from T6/T7 (23.11 km and sol 1175). In reality, Perseverance reached the Margin Unit around Sol 1400 (~28.3 km along traverse) and drove up to the crater rim by Sol 1897 (37.27 km along traverse).

### Non-Destructive Product Solution
Per the prompt instruction (*"Do not replace this data with invented values"*), JEI preserves `targets.geojson` intact. In `TargetDetail.tsx`, JEI transparently displays:
1. Distance label: *"Along rover track from landing: 23.11 km (Stored)"*
2. Accompanying badge: *"Data under review"* with tooltip explaining:  
   *“Traverse track audit indicates along-track distance of ~28.3 km (Sol 1400) for T8 and ~37.3 km (Sol 1897) for T9. Provided dataset holds 23.11 km.”*

---

## 5. Non-Negotiable Pass/Fail Requirement Verification

| # | Requirement | Implementation & Location | Status |
|---|---|---|---|
| 1 | **No Confirmed Life** | T7 shows *"Potential biosignature — not confirmed evidence of life."* in `TargetDetail.tsx`, `AssessmentChips.tsx`. No green badges, no "life detected" strings. | **PASS** |
| 2 | **Four Separate Assessments** | Habitability, Biosignature, Science Value, Accessibility displayed as 4 equal cards. Default view has no composite ranking. | **PASS** |
| 3 | **Counter-Evidence Visible** | T7 default evidence view displays Scheller et al. (2024) abiotic Ce³⁺ luminescence counter-evidence with crimson left border. | **PASS** |
| 4 | **No Safe-Route Claim** | Route mode permanently displays: *"Rover traverse segment. Not a human-rated route."* | **PASS** |
| 5 | **No Local Radiation Claim** | Radiation card permanently states: *"No local RAD measurement at Jezero. MSL RAD measured Gale Crater. This is an analogue/model estimate, not a local measurement."* | **PASS** |
| 6 | **No Shallow-Ice Claim** | Water-ice card states: *"Ancient water is documented. Present-day shallow ice at Jezero is not established."* | **PASS** |
| 7 | **Coordinate Frame Visible** | Status bar displays: *"Mars 2000 planetocentric · equirectangular · positive east"*. | **PASS** |
| 8 | **Basemap Caveat Visible** | Status bar displays: *"Basemap: USGS HiRISE browse · approximate alignment (20 m/px)"*. | **PASS** |
| 9 | **Static App** | Zero backend dependencies, no runtime NASA/PDS API calls, no API keys, fully functional from static `dist/`. | **PASS** |
| 10| **Tests Passing** | `pnpm test` (17/17 passing), `pnpm run build` (0 TS errors), `node scripts/validate-data.mjs` (all passing). | **PASS** |

---

## 6. Prohibited Phrases Audit

Zero violations of prohibited phrases found across all source code, tests, and data files:
* No "life on mars confirmed"
* No "biosignature found"
* No "proof of ancient life"
* No "safe route"
* No "hazard-free"
* No "nasa-approved route"
* No "guaranteed" / "100% safe"
* No "the map proves"
* No "safe walk" / "within safe range"
* No "cleared" / "go/no-go" / "eva-ready"
* No "hazard map" / "trafficable"
