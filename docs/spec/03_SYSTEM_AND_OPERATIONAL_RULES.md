# 03 — System and Operational Rules

These rules are non-negotiable. They override visual preference, speed, and “demo magic.” If a feature cannot satisfy a rule, the feature is cut or the rule is explained in the UI.

The words **MUST**, **MUST NOT**, and **SHOULD** are intentional.

---

## 1. Scientific integrity rules

### R1. No confirmed life

The app MUST NOT state or imply that life has been found on Mars.

**Required copy on the Bright Angel / Cheyava Falls target:**

> **Potential biosignature — not confirmed evidence of life.**

The app MUST also include this statement in the About panel:

> The strongest scientific statement the data support is: Jezero was habitable, and Bright Angel preserves a potential biosignature that requires sample return to resolve. That is not the same as evidence of life.

### R2. Keep the four assessments separate

The app MUST show four independent assessments for every target:

1. **Habitability potential** — could the past environment have supported life?
2. **Biosignature evidence** — are observations consistent with biology, and how well are alternatives understood?
3. **Scientific value** — could the target improve understanding of geological history, mineral formation, or environmental evolution?
4. **Accessibility** — how difficult is the target to reach and work at?

The app MUST NOT collapse these into a single score in the default view. A user-selected weighted view is allowed only if:
- the weights are visible and adjustable;
- the four underlying assessments remain visible;
- the view is labelled “experimental composite — not a scientific conclusion.”

For this build, do not implement the composite view. It is out of scope.

### R3. Label the evidence class

Every evidence record MUST display one of:

- **Observation**
- **Published interpretation**
- **Hypothesis**
- **Public interpretation**
- **Counter-evidence**

Do not display an interpretation as if it were a measurement. Do not display a hypothesis as if it were a finding.

### R4. Show counter-evidence

For any biosignature-related claim, the app MUST show at least one competing explanation or limitation. Counter-evidence MUST be visible in the default evidence list, not hidden behind a “more” disclosure.

For T7, the app MUST include the Scheller et al. (2024) counter-evidence: luminescence signals initially reported as consistent with organics can be explained by inorganic Ce³⁺ in phosphate and silicate defects.

### R5. “Potential” is the ceiling

The biosignature assessment MUST NOT exceed **“Potential”**. Even “Potential (highest documented)” must include “not confirmed.”

### R6. Do not quote unverified numbers

The app MUST NOT display:
- a boulder size from Mangold et al. (2021);
- a flood discharge or lake-level number from Mangold et al. (2021);
- a “confirmed” vivianite or greigite identification (the paper says “likely”);
- a local radiation dose at Jezero;
- a shallow ice thickness or resource volume at Jezero;
- a “safe” or “unsafe” route label.

If a number is not in `app_data`, do not invent it.

### R7. State the coordinate frame

The app MUST display the working CRS in the status bar:

> `Mars 2000 planetocentric · equirectangular · positive east`

The app MUST NOT silently mix planetocentric and planetodetic coordinates. The target register uses planetocentric coordinates. If a source uses planetodetic, convert and document it before adding.

### R8. Disclose basemap alignment

The provided basemap is a **USGS HiRISE orthomosaic browse image** with approximate alignment. The app MUST show:

> `Basemap: USGS HiRISE browse · approximate alignment`

and a tooltip or info button:

> This is a 1024 px browse image. It is not a measurement-grade basemap. Use the full-resolution USGS GeoTIFF for scientific measurement.

### R9. Do not imply local measurement where there is none

The radiation card MUST say:

> No local RAD measurement at Jezero. MSL RAD measured Gale Crater. This is an analogue/model estimate, not a local measurement.

The water-ice card MUST say:

> Ancient water is documented. Present-day shallow ice at Jezero is not established.

### R10. Preserve uncertainty

Every target card MUST show a confidence value and a one-sentence reason. “Confidence” means confidence in the assessment, not confidence in life. Do not use a green checkmark for “confident” in a way that implies “confirmed life.”

---

## 2. Data rules

### D1. Data is read-only

The app MUST treat `public/data/*` as read-only. It MUST NOT write to it, mutate it, or regenerate it at runtime.

### D2. No runtime PDS or NASA API calls

The app MUST NOT fetch PDS, ODE, Mars Trek, USGS, or NASA APIs at runtime. All data is local. Source links may open externally when clicked, but the app itself does not depend on them.

### D3. Validate before render

The app MUST validate the JSON with Zod (or an equivalent runtime schema) before rendering. A validation failure MUST render a readable error, not a blank screen or a silently incomplete UI.

### D4. Missing data is an error state

If a file is missing or malformed:
- show the file name and the expected shape;
- offer a retry;
- do not substitute invented data;
- do not hide the missing layer without a message.

### D5. Source links are traceable

Every evidence record MUST resolve to at least one source in `sources.json`. A source MUST have a citation and a URL. Do not display a bare “source” label.

### D6. No hidden data transformations

If the app derives a value (e.g., a sort rank, a distance, a time estimate), it MUST be computed from the provided data and the formula MUST be documented in code and in the About panel. Do not hard-code a value that looks derived.

### D7. Route data is fixed

The app MUST use the provided `route.geojson` and `route_profile.json`. It MUST NOT generate a new route from a straight line, a shortest-path algorithm, or a slope heuristic. The only route is `R1`.

---

## 3. Map and interaction rules

### M1. The map is not the only interface

Every target MUST be reachable from the left-rail list. Every piece of information shown in a map popup MUST also be available in the detail panel. The map is an enhancement, not the sole access path.

### M2. No false precision

The app MUST show the native resolution of the basemap and the route profile. It MUST NOT claim metre-level accuracy from a 20 m/px browse image.

### M3. Selection is synchronized

Selecting a target on the map MUST select the same target in the list and detail panel. Selecting in the list MUST select the map marker. There is one source of truth: `selectedTargetId`.

### M4. Layer toggles are honest

A layer toggle MUST only appear if the layer has data. If a “Slope” or “Minerals” layer is not loaded, either omit it or show it disabled with a “Data not loaded” tooltip. Do not show an empty layer as if it were active.

### M5. Route mode is explicit

Route mode MUST be a deliberate toggle. When on:
- the route line is visible;
- the route summary and profile are visible;
- the “not a human-rated route” warning is visible.

When off, the route line and profile are hidden.

### M6. No auto-playing motion

Do not auto-play a flyover, a rotating globe, or a long camera animation. A user-triggered `flyTo` of ≤ 600 ms is allowed. Respect `prefers-reduced-motion`.

### M7. Keyboard access

All controls MUST be reachable by keyboard. The target list MUST be navigable with arrow keys or Tab. The map MUST have a keyboard-focusable container with a text description. The elevation profile MUST be focusable and expose the data in text.

### M8. Color is not the only signal

Assessment levels, evidence classes, and warnings MUST use text labels and/or icons, not color alone. A user with deuteranopia must be able to distinguish “Potential” from “High.”

---

## 4. Content and copy rules

### C1. Use the exact scientific phrases

Use:

- “Potential biosignature — not confirmed evidence of life.”
- “Likely vivianite and greigite” (not “confirmed vivianite and greigite”).
- “Rover traverse segment. Not a human-rated route.”
- “No local RAD measurement at Jezero.”
- “Present-day shallow ice at Jezero is not established.”
- “Planning aid, not a safety certification.”

### C2. Do not use these phrases

Do not use:

- “Life on Mars confirmed”
- “Biosignature found”
- “Proof of ancient life”
- “Safe route”
- “Hazard-free”
- “NASA-approved route”
- “Guaranteed”
- “100% safe”
- “The map proves”

### C3. Explain jargon on first use

On first use, explain:
- planetocentric vs planetodetic;
- HiRISE, CTX, CRISM;
- DTM;
- biosignature;
- habitability;
- traverse.

Use the glossary in `05_PROJECT_CONTEXT_AND_MEMORY.md`.

### C4. Attribution is visible

The About panel MUST list the data sources and publications. The status bar MUST include a “Data & methods” link. Source links MUST open the DOI or official page.

---

## 5. Operational rules

### O1. Static deployment only

The app MUST build to static files and run without a backend. No server, no database, no cron, no API keys.

### O2. Performance budgets

| Metric | Budget |
|---|---|
| Initial JS (gzip) | ≤ 350 KB |
| Initial CSS (gzip) | ≤ 30 KB |
| Total local data | ≤ 1.5 MB |
| First contentful paint (local) | ≤ 1.5 s |
| Map pan/zoom | 60 fps on a 2020-era laptop |
| Route profile render | ≤ 16 ms |

If a dependency would exceed the budget, remove it. Do not add a 3D globe, a heavy chart library, or a video player.

### O3. Browser support

Support the current stable versions of Chrome, Edge, Firefox, and Safari. Do not use APIs that require a polyfill without adding it.

### O4. No tracking

No analytics, cookies, fingerprinting, or third-party scripts. The app is a static educational tool.

### O5. Error logging

In development, log validation errors with the JSON path. In production, show a user-readable error card. Do not expose stack traces in the UI.

### O6. Build reproducibility

`pnpm install --frozen-lockfile` MUST work from a clean checkout. Commit the lockfile. Do not rely on globally installed packages.

### O7. Accessibility target

WCAG 2.1 AA for text contrast, focus visibility, keyboard access, and non-text content. The map itself is exempt from full conformance only because the list/detail view provides an equivalent experience; the rest of the app must conform.

---

## 6. Testing rules

### T1. Unit tests

Test:
- `sortTargets` for all four objectives;
- assessment parsing for compound strings;
- coordinate and elevation formatting;
- source resolution.

### T2. Component tests

Test:
- selecting T7 shows the potential-biosignature copy;
- selecting T7 shows the counter-evidence;
- the radiation card says “No local RAD measurement”;
- route mode shows the correct distance/ascent/descent/max grade;
- the four assessment chips are separate.

### T3. E2E smoke test

The Playwright smoke test MUST:
1. Load the app.
2. Select T7 from the list.
3. Assert the phrase “Potential biosignature — not confirmed evidence of life.”
4. Assert a source link is visible.
5. Toggle route mode.
6. Assert the route summary contains `23.3 km`, `+452 m`, and `29.9%`.
7. Assert the “not a human-rated route” warning is visible.

### T4. No false positives

A test that only checks for the presence of a heading is not enough. Assert the specific scientific copy and the specific numbers.

---

## 7. Incident and fallback rules

If something breaks:

1. **Do not fabricate data.** A missing layer is better than a fake layer.
2. **Do not hide the failure.** Show a visible “Data not loaded” state.
3. **Do not change the scientific claim to make the UI simpler.** The claim is the product.
4. **Record the failure** in `BUILD_STATUS.md` with the exact file and error.
5. **Cut scope, not integrity.** Remove a feature before weakening a rule.

### Allowed fallbacks

| Failure | Allowed fallback |
|---|---|
| Basemap image missing | Dark grid background + “Basemap not loaded” + still show targets/traverse |
| Route JSON missing | Disable route mode + “Route data not loaded” |
| Evidence JSON missing | Show target summary + “No evidence records loaded” |
| Sources JSON missing | Show source IDs as text + “Source metadata not loaded” |
| MapLibre fails to initialize | Show a static target map/list view + error banner |
| Font fails to load | Use system font stack; do not block render |

### Disallowed fallbacks

- Invented coordinates.
- Invented observations.
- A straight-line route presented as the science traverse.
- A fake slope raster.
- A fake radiation number.
- A “confirmed” label.
- A “safe” badge.

---

## 8. Definition of operational done

The build is operationally done when:

- `pnpm build` succeeds;
- `pnpm test` passes;
- the Playwright smoke test passes;
- the app runs from `dist/` with `pnpm preview`;
- the status bar shows the CRS and basemap caveat;
- the About panel shows sources and limitations;
- no text claims confirmed life;
- no route is called safe;
- no local radiation measurement is implied;
- the app works at 1440×900 and 390×844;
- `BUILD_STATUS.md` is complete.
