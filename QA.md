# Jezero Expedition Intelligence (JEI) — Quality Assurance & Test Verification

**NASA Space Apps Challenge 2026** — *Challenge 11: Interplanetary Survival Guide: Martian Map*

---

## 1. Non-Negotiable Pass/Fail Verification Matrix

| # | Verification Criterion | Validation Method | Result | Evidence / File Reference |
|---|---|---|---|---|
| **1** | **No Confirmed Life Claim** | Automated grep + Component Test + E2E smoke test | **PASS** | `src/test/components.test.tsx`, `src/lib/constants.ts`: *“Potential biosignature — not confirmed evidence of life.”* |
| **2** | **Four Separate Assessments** | Component test + Visual audit | **PASS** | `src/components/targets/AssessmentChips.tsx`: Habitability, Biosignature, Science, Accessibility rendered as 4 distinct cards. |
| **3** | **Counter-Evidence by Default** | Vitest component test + E2E assertion | **PASS** | `src/components/targets/EvidenceCard.tsx`: Crimson left border, Scheller et al. 2024 counter-evidence visible without manual toggle. |
| **4** | **No Safe Route Claim** | Component test + E2E assertion | **PASS** | `src/components/route/RoutePanel.tsx`: *“Rover traverse segment. Not a human-rated route.”* |
| **5** | **No Local Radiation Claim** | Component test + Data validator | **PASS** | `src/components/environment/EnvironmentDrawer.tsx`: *“No local RAD measurement at Jezero.”* |
| **6** | **No Shallow Ice Claim** | Component test + Data validator | **PASS** | `src/components/environment/EnvironmentDrawer.tsx`: *“Present-day shallow ice at Jezero is not established.”* |
| **7** | **Coordinate Frame Transparency** | DOM inspection + Unit test | **PASS** | `src/components/layout/StatusBar.tsx`: *“Mars 2000 planetocentric · equirectangular · positive east”*. |
| **8** | **Basemap Caveat Transparency** | DOM inspection + Unit test | **PASS** | `src/components/layout/StatusBar.tsx`: *“Basemap: USGS HiRISE browse · approximate alignment (20 m/px)”*. |
| **9** | **Static App Architecture** | Build & network inspection | **PASS** | `dist/` contains solely static HTML/JS/CSS/GeoJSON; zero runtime API calls or backend servers. |
| **10**| **All Automated Tests Pass** | `pnpm test`, `node scripts/validate-data.mjs` | **PASS** | 17 Vitest tests passing; all data integrity schemas passing. |

---

## 2. Test Suite Breakdown

### Unit Tests (`src/test/unit.test.ts` — 12 tests)
- **Coordinate Formatting:** Correctly formats planetocentric coordinates (e.g. `18.4446° N, 77.4509° E`).
- **Elevation Formatting:** Appends correct signs (`+452 m`, `-237 m`) and unit markers.
- **Distance & Grade Formatting:** Formats distances in kilometers/meters and grades in percentage.
- **Compound Score Parsing:** Extracts highest ordinal weight for compound strings (e.g. `"Moderate to High"` → 3).
- **Objective Sorting — Geological History:** Correctly orders targets by science value and confidence.
- **Objective Sorting — Habitability:** Prioritizes lacustrine delta targets.
- **Objective Sorting — Biosignature Evidence:** Correctly places T7 (Bright Angel) first.
- **Objective Sorting — Accessibility:** Correctly places T1 (Landing) first and T8/T9 (rim) last.
- **Mars Spherical Geodesy:** Verifies `distanceM` against known Great Circle benchmarks using $R = 3,396,190\text{ m}$.
- **EVA Walk-Back Calculations:** Verifies sortie radius under nominal, conservative, and extended parameters.
- **EVA Reachability Classifier:** Tests boundary inclusion/exclusion against target coordinate pairs.
- **Prohibited Phrases Unit Guard:** Scans constant copy to ensure zero prohibited words.

### Component Tests (`src/test/components.test.tsx` — 5 tests)
- **T7 Potential Biosignature Copy:** Asserts exact string `"Potential biosignature — not confirmed evidence of life."` renders in TargetDetail.
- **T7 Counter-Evidence Display:** Verifies Scheller et al. 2024 Ce³⁺ luminescence counter-evidence renders with prominent styling.
- **Route R1 Numerical Integrity:** Verifies RoutePanel displays `23.3 km`, `+452 m`, `-237 m`, `29.9%`, and the non-negotiable warning.
- **Environmental Drawer Disclaimers:** Verifies radiation and water ice cards show required caveats.
- **Assessment Chips Quad-Layout:** Verifies 4 separate chips render without composite score aggregation.

### Automated Data Validation Script (`scripts/validate-data.mjs`)
- Validates existence and JSON schema validity of all 10 core assets.
- Enforces presence of exactly 9 targets in `targets.geojson`.
- Enforces 23.3 km, +452 m, -237 m, 29.9% in `route_profile.json`.
- Enforces 14+ records and T7 counter-evidence in `evidence.json`.
- Scans every JSON/GeoJSON file in `public/data/` for 16 prohibited marketing phrases (zero violations).

---

## 3. Accessibility & Usability (a11y) Verification

- **Keyboard Navigation:** Full tab-order navigation supported across TopBar buttons, target list items (`role="listitem"`), drawers, and elevation scrubbers.
- **Focus Rings:** Distinct, high-contrast amber focus rings (`focus:ring-2 focus:ring-accent`) visible on all interactive controls.
- **Color Contrast:** All text meets WCAG AA contrast standards (minimum 4.5:1 ratio against graphite `#0B0F14` and `#141A22` backgrounds).
- **Non-Color Encoding:** Confidence and assessment ratings combine color coding with explicit textual labels, tooltip disclosures, and font-weight cues.
- **Responsive Viewport Support:**
  - **Desktop (1440×900+):** Full 3-column layout (Left Rail, Map, Right Detail Panel).
  - **Tablet (768–1024px):** Map with slide-over drawers for Target Detail and Route Analysis.
  - **Mobile (390×844 / iPhone):** Fullscreen map with interactive bottom-sheet drawer.
