# Jezero Expedition Intelligence (JEI)

**Evidence-First Science Atlas & EVA Traverse Planning Model for Jezero Crater, Mars**  
*NASA Space Apps Challenge 2026 — Challenge 11: Interplanetary Survival Guide: Martian Map*

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-17%20passed-brightgreen.svg)]()
[![Scientific Guardrails](https://img.shields.io/badge/Guardrails-Enforced-success.svg)]()

---

## 1. Mission & Product Summary

**Jezero Expedition Intelligence (JEI)** is a local-scale, evidence-first science map and operational EVA planning aid for Jezero Crater, Mars. Rather than aggregating qualitative data into a speculative composite score or black-box rating, JEI provides astronauts, scientists, and mission planners with a transparent explanation of **why** a target matters, **how strong** the underlying data is, **what counter-evidence could disprove** the interpretation, and **how difficult** the terrain is to traverse.

### The Problem with Conventional Martian Maps
Most space application maps either provide broad global overlays with no operational depth or attempt to compute arbitrary "habitability scores" that gloss over critical scientific uncertainties. 

### The JEI Approach
* **Four Independent Assessments:** Habitability potential, biosignature evidence, scientific value, and accessibility are kept strictly separate.
* **Counter-Evidence by Default:** Scientific interpretations (such as the vivianite/greigite "leopard spots" at Cheyava Falls) display published alternative abiotic explanations directly alongside supporting claims.
* **Operational Walk-Back Model:** Models realistic human extravehicular activity (EVA) limits using metabolic walk-back constraints, terrain slopes, consumable windows, and Mars-specific geodesy ($R = 3,396,190\text{ m}$).
* **Strict Scientific Integrity:** Zero speculative claims of confirmed life, zero claims of safe routes, zero false assumptions of local radiation instruments.

---

## 2. Key Features

```
┌────────────────────────────────────────────────────────────────────────┐
│ TopBar: Brand · Mission Objectives · EVA Sortie · Route R1 · Overlays  │
├───────────────────┬────────────────────────────────┬───────────────────┤
│ LeftRail          │ MapView (MapLibre GL)          │ RightPanel        │
│                   │                                │                   │
│ • Search Targets  │ • USGS HiRISE Orthomosaic (20m)│ • Target Detail   │
│ • 4 Objective     │ • Mars 2000 Planetocentric CRS │ • 4 Assessment    │
│   Sort Modes      │ • Sols 0–1897 Traverse Track   │   Chips           │
│ • 9 Target Cards  │ • R1 Science Route & Waypoints │ • Evidence Cards  │
│ • Sample Status   │ • Dynamic EVA Walk-Back Circle │ • Counter-Evidence│
│ • Map Layer Legend│ • USGS SIM 3464 Geologic Units │ • Source DOIs     │
│                   │ • Mars 2000 Sphere Scale Bar   │ • Photojournal POV│
├───────────────────┴────────────────────────────────┴───────────────────┤
│ StatusBar: CRS Frame · Basemap Alignment · DTM Resolution · Disclaimers│
└────────────────────────────────────────────────────────────────────────┘
```

1. **Local-Scale Jezero Basemap & Coordinate System**
   - High-resolution USGS Astrogeology Terrain Relative Navigation (TRN) HiRISE orthomosaic browse (20 m/px).
   - Mars 2000 planetocentric coordinate reference system, equirectangular projection, positive east longitude ($77.22^\circ\text{E}$ to $77.58^\circ\text{E}$, $18.35^\circ\text{N}$ to $18.55^\circ\text{N}$).
   - Custom Mars 2000 sphere scale bar ($R = 3,396,190\text{ m}$) avoiding inaccurate Earth ellipsoid calculations.

2. **The Nine Canonical Science Targets (T1–T9)**
   - **T1:** Octavia E. Butler Landing (Operational Origin)
   - **T2:** Séítah (Olivine-Rich Cumulate & Igneous Floor)
   - **T3:** Máaz (Crater Floor Basaltic Andesite)
   - **T4:** Western Delta Front / Shenandoah (Mudstones & Deltaic Stratigraphy)
   - **T5:** Upper Delta / Cape Nukshak Vicinity (Coarse Sandstone & Fluvial Conglomerates)
   - **T6:** Neretva Vallis Entry (Inflow Channel Breccia & Carbonate Boulders)
   - **T7:** Bright Angel / Cheyava Falls (Mudstone with Reaction Rims / Potential Biosignature)
   - **T8:** Margin Unit / Mandu Wall (Carbonate & Silica Precipitation)
   - **T9:** Western Crater Rim (Pre-Noachian Megabreccia & Ancient Crust)

3. **Objective-Based Sorting (Qualitative, Not Composite)**
   - **Geological History:** Prioritizes stratigraphic age, igneous context, and crustal evolution.
   - **Habitability Potential:** Prioritizes sustained lacustrine and aqueous environments.
   - **Biosignature Evidence:** Places T7 first based on documented organic detection and redox reaction textures.
   - **Accessibility:** Prioritizes operational ingress and proximity from landing point.

4. **Rover Science Route R1 & Elevation Profile**
   - Verified 23.3 km traverse segment connecting T1 through T7.
   - Pure SVG elevation chart with scrubbable waypoints displaying gross ascent (+452 m), gross descent (-237 m), and max apparent grade (29.9%).
   - Transparent elevation disclosure highlighting micro-topographic gross climbing (+452 m) vs. smoothed human-scale grade baseline (~301 m) and net elevation rise (+215 m).

5. **EVA Sortie Operational Planning Model**
   - Interactive EVA sortie radius calculation centered at any chosen landing or rover anchor.
   - Adjustable inputs: EVA duration (2–8 hrs), human walking speed (0.8–2.5 km/h), stationary sampling allowance (5–30 min/target), safety reserve (10–35%), and terrain grade penalties.
   - Real-time reachability readouts for all 9 targets (*Inside radius* vs. *Outside radius*).
   - Clear operational boundary: *Operational Planning Aid — Not a Certified Safety System*.

6. **Contextual Environmental Matrix**
   - Five environmental domain cards:
     - **Radiation:** Analogue/Model (MSL RAD Gale Crater). *Mandatory caveat: No local RAD measurement at Jezero.*
     - **Atmosphere:** Measured (Perseverance MEDA pressure, temp, wind, RH).
     - **Terrain:** Measured (HiRISE DTM 1 m/px & traverse grades).
     - **Water Ice:** Unknown (SWIM mid-to-high latitude data). *Mandatory caveat: Present-day shallow ice at Jezero is not established.*
     - **Mobility:** Design Assumptions (1.5 km/h walking + 10 min/stop; 4 h window).

7. **Geographic & Photographic Grounding**
   - **USGS SIM 3464 Geologic Units:** Interactive polygon overlay mapping the Crater Floor, Delta, and Margin units.
   - **Ground-Level POV Views:** High-resolution NASA/JPL-Caltech/MSSS/LANL photojournal imagery linked to targets (e.g. PIA26368 for Cheyava Falls, PIA24836 for Séítah).

---

## 3. Non-Negotiable Scientific Guardrails

This project strictly adheres to the non-negotiable rules defined in `docs/spec/03_SYSTEM_AND_OPERATIONAL_RULES.md`:

1. **No Confirmed Life:** The app never claims or implies that life has been found. Target T7 explicitly states:  
   *`Potential biosignature — not confirmed evidence of life.`*
2. **Four Separate Assessments:** Habitability potential, biosignature evidence, scientific value, and accessibility are never collapsed into a single composite score.
3. **Counter-Evidence by Default:** T7 displays the Scheller et al. (2024) Ce³⁺ luminescence and abiotic redox explanations directly in the primary evidence panel.
4. **No Safe Route Claims:** Route R1 permanently displays:  
   *`Rover traverse segment. Not a human-rated route.`*
5. **No Local Radiation Claims:** The radiation card permanently states:  
   *`No local RAD measurement at Jezero. MSL RAD measured Gale Crater. This is an analogue/model estimate, not a local measurement.`*
6. **No Shallow Ice Claims:** The water-ice card permanently states:  
   *`Ancient water is documented. Present-day shallow ice at Jezero is not established.`*
7. **Coordinate Frame Transparency:** Status bar shows:  
   *`Mars 2000 planetocentric · equirectangular · positive east`*.
8. **Basemap Caveat Transparency:** Status bar shows:  
   *`Basemap: USGS HiRISE browse · approximate alignment (20 m/px)`*.
9. **Zero Prohibited Phrases:** Continuous automated testing enforces 0 occurrences of marketing hyperbole (`safe route`, `life on mars confirmed`, `cleared`, `hazard-free`, etc.).

---

## 4. Tech Stack & Architecture

- **Runtime:** React 19.3.1 (Modern Hooks, functional components)
- **Language:** TypeScript 7.0.2 (Strict mode enabled, zero `any` without justification)
- **State:** Zustand 5.1.0 (Synchronized target selection, filters, layers, EVA parameters)
- **Map Engine:** MapLibre GL 6.18.0 (Custom raster canvas and vector GeoJSON layers)
- **Styling:** Tailwind CSS 3.4.17 (Graphite `#0B0F14` theme, Amber `#F2A33A` accents, Cyan `#5CC8D7` observations)
- **Validation:** Zod 4.6.7 (Runtime validation of all static data contracts)
- **Testing:** Vitest 2.1.8 + Happy-DOM 15.11.7 + Playwright 1.65.0
- **Build:** Vite 6.2.0 (`dist/` fully static, zero runtime backend requirements)

---

## 5. Quick Start Guide

### Prerequisites
- Node.js v20+ or v24+
- `pnpm` (v9+ or v12+)

### Installation
```bash
# Clone the repository
git clone https://github.com/txtx1182-cyber/MARtian_sapian01.git
cd MARtian_sapian01

# Install dependencies
pnpm install
```

### Development Server
```bash
# Start local development server at http://localhost:5173
pnpm dev
```

### Run Tests & Audits
```bash
# Run unit & component tests (17 tests)
pnpm test

# Run data integrity & prohibited phrases validator
node scripts/validate-data.mjs

# Run science target along-track distance audit
node scripts/audit-targets.mjs

# Run Route R1 elevation profile audit
node scripts/audit-route.mjs

# Run Playwright E2E smoke tests
pnpm test:e2e
```

### Production Build & Preview
```bash
# Build static site to dist/
pnpm build

# Preview static distribution locally
pnpm preview
```

---

## 6. Deployment (Render)

This repository includes a native [`render.yaml`](render.yaml) blueprint for one-click deployment as a Render Static Site:

```yaml
services:
  - type: web
    name: martian-sapian
    runtime: static
    buildCommand: npm install -g pnpm && pnpm install --frozen-lockfile && pnpm build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

---

## 7. Documentation Index

- [`BUILD_STATUS.md`](BUILD_STATUS.md) — Comprehensive technical audit, real vs. derived data matrix, and T8/T9 reconciliation.
- [`DATA_SOURCES.md`](DATA_SOURCES.md) — Complete scientific bibliography, PDS datasets, USGS maps, and DOIs.
- [`METHODOLOGY.md`](METHODOLOGY.md) — Scientific rationale, sorting algorithms, and EVA walk-back physics.
- [`CREDITS.md`](CREDITS.md) — Attribution to NASA, USGS, instrument science teams, and researchers.
- [`DEMO_SCRIPT.md`](DEMO_SCRIPT.md) — 2-minute step-by-step presentation walkthrough for evaluators.
- [`QA.md`](QA.md) — Complete quality assurance matrix, test coverage, and a11y audit.

---

## 8. License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.  
Planetary imagery and rover datasets courtesy of NASA / JPL-Caltech / USGS Astrogeology / MSSS / LANL.
