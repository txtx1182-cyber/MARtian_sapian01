# 02 — Implementation Phases

This is the build order for Antigravity. Do not skip ahead. Each phase has a concrete output and an acceptance check. If a phase fails, fix it before continuing.

**Total budget:** 10–14 focused hours. A capable agent should reach a working demo in 6–8 hours and spend the remaining time on QA and polish.

---

## Phase 0 — Read, verify, scaffold (30–45 min)

### Tasks

1. Read, in order:
   - `00_MASTER_ANTIGRAVITY_PROMPT.md`
   - `03_SYSTEM_AND_OPERATIONAL_RULES.md`
   - `05_PROJECT_CONTEXT_AND_MEMORY.md`
   - `01_SYSTEM_ARCHITECTURE.md`
   - `02_IMPLEMENTATION_PHASES.md` (this file)
   - `04_VISUAL_DESIGN_UI_UX.md`
   - `06_TECH_STACK.md`
   - `07_PROJECT_REQUIRED_DOCUMENT.md`
2. Confirm `app_data/` contains all files listed in `README.md`.
3. Create the Vite + React + TypeScript project.
4. Install dependencies from `06_TECH_STACK.md`.
5. Copy `app_data/*` into `public/data/`.
6. Start the dev server and confirm the default Vite page loads.
7. Create `BUILD_STATUS.md` with the phase checklist.

### Commands

```bash
pnpm create vite jezero-expedition-intelligence --template react-ts
cd jezero-expedition-intelligence
pnpm install
pnpm add maplibre-gl zustand clsx tailwind-merge lucide-react zod
pnpm add -D tailwindcss@3.4.17 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom playwright
pnpm exec tailwindcss init -p
mkdir -p public/data
cp -r ../app_data/* public/data/
pnpm dev
```

### Acceptance

- [ ] `pnpm dev` runs without errors.
- [ ] `public/data/manifest.json` is reachable at `/data/manifest.json`.
- [ ] `public/data/basemap_jezero_1024.jpg` is reachable.
- [ ] `BUILD_STATUS.md` exists.
- [ ] No source file contains a secret or API key.

### Stop condition

If any `app_data` file is missing or invalid JSON, stop and report the exact file. Do not invent replacement data.

---

## Phase 1 — Shell, tokens, and map (2–3 h)

### Tasks

1. Create the design tokens in `src/styles/tokens.css` from `04_VISUAL_DESIGN_UI_UX.md`.
2. Create the shell:
   - `TopBar` with brand, objective selector, route toggle, environment button, about button.
   - `LeftRail` with a placeholder target list.
   - `MapView` with MapLibre and the basemap.
   - `RightPanel` with an empty state.
   - `StatusBar` with CRS, basemap alignment, resolution, and “planning aid” copy.
3. Implement the MapLibre style with:
   - background
   - basemap image source
   - `traverse` line
   - `targets` circle + label layers
   - selected target ring
4. Add target markers from `targets.geojson`.
5. Add the left-rail target list from the same data.
6. Sync selection: list ↔ map.
7. Add the basemap alignment warning.

### Acceptance

- [ ] The map fills the main area and shows the Jezero browse image.
- [ ] All 9 target markers render with codes T1–T9.
- [ ] Clicking a marker selects it and highlights the corresponding list row.
- [ ] Clicking a list row selects the marker and opens the right panel.
- [ ] The status bar shows `Mars 2000 planetocentric · equirectangular · positive east` and `Basemap: USGS HiRISE browse · approximate alignment`.
- [ ] The basemap warning is visible without opening a menu.
- [ ] No console errors.
- [ ] The layout works at 1440×900 and 1280×800.

### Common failure

MapLibre image source coordinates are easy to invert. The order is top-left, top-right, bottom-right, bottom-left, and each is `[lon, lat]`. If the image is upside down, fix the corners, not the CSS.

---

## Phase 2 — Target detail and evidence (2–3 h)

### Tasks

1. Build `TargetDetail` with:
   - name, code, unit
   - coordinates and elevation
   - confidence badge
   - four assessment chips
   - summary
2. Build `AssessmentChips` with tooltips that explain each dimension.
3. Build the evidence list:
   - filter `evidence.json` by `target_id`
   - render each record with class badge, claim, instrument, confidence, source, counter-evidence, “what would change”
   - counter-evidence must be visually distinct (left border / different background), not hidden behind a disclosure.
4. Build `SourceLink`:
   - map `source_ids` to `sources.json`
   - open in a new tab with `rel="noopener noreferrer"`
   - show the citation, not just the ID.
5. Add an empty state for targets with no evidence records.

### Acceptance

- [ ] Selecting T7 shows the Bright Angel evidence records, including the counter-evidence from Scheller et al. (2024).
- [ ] Selecting T2 shows the Séítah observations and the “water-poor” caveat.
- [ ] The four assessment chips are visually separate and never combined into a single number.
- [ ] Source links open the correct DOI/URL.
- [ ] No target card says “confirmed life” or “biosignature found.”
- [ ] The phrase “Potential biosignature — not confirmed evidence of life” appears on T7.

---

## Phase 3 — Objective sorting and comparison (1–2 h)

### Tasks

1. Implement the objective selector: Geological history, Habitability, Biosignature, Accessibility.
2. Implement `sortTargets` in `src/lib/sort.ts`:
   - **Geological:** science desc, confidence desc.
   - **Habitability:** habitability desc, science desc.
   - **Biosignature:** biosignature desc, then the number of biosignature evidence records desc, then confidence desc.
   - **Accessibility:** access asc (Easy first), distance asc.
3. Map qualitative levels to sort weights **only for sorting**, never for display:
   - High = 3, Moderate = 2, Low = 1, Unknown = 0.
   - For compound strings, use the highest token (e.g., “Moderate–Low” = 2).
   - “Potential” = 3 for biosignature sorting only; display remains “Potential (not confirmed).”
4. Show a line above the list: `Sorted by biosignature evidence · qualitative, not a composite score`.
5. Change the marker ring color by objective, but keep the target code and the four-chip detail unchanged.
6. Add a “Reset” control that returns to Geological history.

### Acceptance

- [ ] Switching to Biosignature puts T7 first.
- [ ] Switching to Accessibility puts T1 first and T8/T9 last.
- [ ] The list reorders with a smooth transition, no page reload.
- [ ] The sort label is visible and explains the qualitative basis.
- [ ] The four assessments in the detail panel do not change when the objective changes.
- [ ] No composite score is displayed anywhere.

---

## Phase 4 — Route mode and elevation profile (1.5–2 h)

### Tasks

1. Add route mode toggle to the top bar.
2. When route mode is on:
   - show `route.geojson` line
   - fit bounds to the route
   - show `RoutePanel` in the right panel
   - show `ElevationProfile` above the status bar (or as a bottom panel)
3. `RoutePanel` shows:
   - 23.3 km distance
   - +452 m ascent / −237 m descent
   - max grade 29.9%
   - start/end targets and waypoints
   - assumptions list from `route_profile.json`
   - “Rover traverse segment. Not a human-rated route.” warning
4. `ElevationProfile`:
   - pure SVG, no chart library
   - x = distance, y = elevation
   - hover/focus shows distance + elevation
   - keyboard accessible (focusable points or a range input)
   - target markers at the nearest route point for T1, T2, T4, T6, T7
5. Add a “Show route” action on target detail for T1/T2/T4/T6/T7; it turns on route mode and zooms to the nearest route point.

### Acceptance

- [ ] Route mode draws a single amber line.
- [ ] The profile matches `route_profile.json`.
- [ ] The summary numbers match the JSON exactly.
- [ ] The assumptions and “not a human-rated route” copy are visible.
- [ ] The profile is readable at 1280 px and 390 px.
- [ ] No route is generated dynamically; the fixed `R1` is the only route.

---

## Phase 5 — Environment, about, and responsive polish (1.5–2 h)

### Tasks

1. Build `EnvironmentDrawer` from `environment.json`:
   - five cards: Radiation, Atmosphere, Terrain, Water ice, Mobility
   - kind badge: Measured / Analogue / Model / Unknown / Assumption
   - source links
   - radiation card explicitly says “No local RAD measurement”
2. Build `AboutDrawer`:
   - “What this is”
   - “What this is not”
   - methods: four assessments, qualitative sort, no composite score
   - coordinate and basemap caveats
   - sources list
   - no-life statement
3. Responsive behavior:
   - ≥ 1200 px: three-column layout (left rail, map, right panel)
   - 800–1199 px: left rail collapses to a drawer; right panel overlays
   - < 800 px: map + bottom sheet; target list and detail in the sheet
4. Accessibility pass:
   - focus rings
   - keyboard selection
   - `aria-label` on map and controls
   - target list is a `listbox` or a semantic list with buttons
   - no color-only encoding
5. Copy pass: exact strings from `04_VISUAL_DESIGN_UI_UX.md`.

### Acceptance

- [ ] Environment drawer opens and closes with keyboard and click.
- [ ] Radiation card does not imply a local measurement.
- [ ] About drawer contains the no-life statement and data caveats.
- [ ] At 390×844 the app is usable and the map is not covered by a permanent panel.
- [ ] Tab order is logical; focus is visible.
- [ ] All text meets WCAG AA contrast on the dark background.

---

## Phase 6 — Tests, build, QA, demo (1.5–2 h)

### Tasks

1. Unit tests:
   - `sortTargets` for all four objectives
   - `formatCoordinate` and `formatElevation`
   - assessment parsing for compound strings
2. Component tests:
   - target selection updates detail
   - T7 shows “Potential biosignature — not confirmed evidence of life”
   - route summary renders the correct numbers
   - environment radiation card says “No local RAD measurement”
3. E2E smoke test (Playwright):
   - load app
   - select T7 from the list
   - verify the evidence card and source link
   - toggle route mode
   - verify the route summary and profile
4. Production build:
   - `pnpm build`
   - `pnpm preview`
   - verify the app works from `dist/`
5. QA checklist from `07_PROJECT_REQUIRED_DOCUMENT.md`.
6. Write `BUILD_STATUS.md`:
   - what is implemented
   - what is mocked (if anything)
   - what is not implemented
   - known issues
   - screenshots
7. Record a 3-minute demo script or a short screen capture.

### Acceptance

- [ ] `pnpm build` succeeds with zero TypeScript errors.
- [ ] `pnpm test` passes.
- [ ] Playwright smoke test passes.
- [ ] `pnpm preview` serves a working app.
- [ ] No console errors on load or selection.
- [ ] `BUILD_STATUS.md` is complete.
- [ ] The demo can be delivered in 3 minutes.

---

## Phase 7 — Optional stretch (only after all acceptance checks pass)

Do not start these until the core app is complete.

- **Full-resolution basemap:** crop the 6.9 GB USGS HiRISE GeoTIFF to the map bounds and export a 4096 px WebP. Update `manifest.json` and remove the “approximate” warning only after checking alignment against known targets.
- **Slope raster:** derive a slope raster from the HiRISE DTM, export a small PNG/WebP, add a `slope` layer, and add a legend. Do not fake it.
- **CRISM mineral overlay:** export a classified mineral raster or a set of mineral polygons with provenance. Add a legend and per-class confidence.
- **Multiple routes:** add a second route with a different science objective. Keep the route data static.
- **Guided tour:** a 5-step tour that highlights the four assessments, the evidence chain, and the route caveats.

---

## Build order summary

| Phase | Output | Time | Gate |
|---|---|---:|---|
| 0 | Scaffold + data copy | 0.5–0.75 h | Dev server runs |
| 1 | Shell + map + markers | 2–3 h | 9 targets, selection sync |
| 2 | Target detail + evidence | 2–3 h | Four chips + counter-evidence |
| 3 | Objective sorting | 1–2 h | T7 first for biosignature |
| 4 | Route + profile | 1.5–2 h | Numbers match JSON |
| 5 | Environment + about + responsive | 1.5–2 h | Mobile usable |
| 6 | Tests + build + QA | 1.5–2 h | Build/test pass |
| 7 | Optional stretch | — | Core done first |

---

## Failure protocol

If a phase cannot be completed:

1. Do not delete or rewrite the provided data.
2. Record the blocker in `BUILD_STATUS.md` with the exact file, error, and attempted fix.
3. Implement the smallest honest fallback:
   - missing basemap → dark schematic background + “basemap not loaded”
   - missing route → disable route mode + “route data not loaded”
   - missing evidence → empty state + “no evidence records”
4. Continue with the next phase only if the fallback does not violate the scientific rules.
5. Report the blocker in the final response.

**Never** fill a gap with invented coordinates, invented observations, or a fake “confirmed” label.
