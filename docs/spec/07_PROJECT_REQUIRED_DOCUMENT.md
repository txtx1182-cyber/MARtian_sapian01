# 07 — Project Required Documents and Submission Pack

This file defines the documents the team must produce **in addition to the working app**. Antigravity should generate the project README and the in-app About content; the team should review and sign off on the scientific copy.

---

## 1. Required documents checklist

| Document | Owner | Where it lives | Status |
|---|---|---|---|
| Project README | Agent + team | `README.md` | Required |
| In-app About / Methods | Agent | `AboutDrawer` | Required |
| Data provenance table | Team | `DATA_SOURCES.md` | Required |
| Scientific methodology | Team | `METHODOLOGY.md` | Required |
| Credits and license | Team | `CREDITS.md` | Required |
| Demo script | Team | `DEMO_SCRIPT.md` | Required |
| QA checklist | Agent + team | `QA.md` | Required |
| Risk register | Team | `RISKS.md` | Recommended |
| Judging map | Team | `JUDGING_MAP.md` | Recommended |
| Screenshot set | Team | `screenshots/` | Required |
| 3-minute pitch | Team | `PITCH.md` | Recommended |

Do not submit the app without the README, data provenance, credits, and demo script.

---

## 2. Project README template

```markdown
# Jezero Expedition Intelligence

A science evidence atlas and traverse planner for Jezero Crater, Mars.

## What it is

Jezero Expedition Intelligence (JEI) is a local-scale, evidence-first map of nine documented science targets in Jezero Crater. It separates four assessments — habitability potential, biosignature evidence, scientific value, and accessibility — and shows the evidence, source, confidence, and counter-evidence behind each target.

## What it is not

- It is not a confirmed detection of life.
- It is not a human-rated route or a safety certification.
- It is not a global Mars map.
- It is not a real-time weather or radiation system.

## Why Jezero

Jezero combines an ancient lake and delta, igneous crater-floor rocks, carbonate-bearing units, clay and altered minerals, dense orbital coverage, and extensive Perseverance observations. It is one of the best-documented places on Mars for a science-driven map.

## Features

- Nine science targets with qualitative assessments.
- Four separate assessment dimensions; no composite score.
- Evidence cards with class, instrument, source, confidence, and counter-evidence.
- Rover traverse and a fixed science traverse with an elevation profile.
- Environment panel with measured, analogue, model, unknown, and assumption labels.
- Coordinate and basemap caveats visible in the UI.

## Data

All data is local and static in `public/data/`. No backend, no API keys, no runtime NASA API calls.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:5173`.

## Build

```bash
pnpm build
pnpm preview
```

## Test

```bash
pnpm test
pnpm test:e2e
```

## Scientific statement

Jezero was habitable. Bright Angel / Cheyava Falls preserves a potential biosignature that requires sample return to resolve. That is not the same as evidence of life.

## License

Code: MIT (or the team's chosen license).  
Data: NASA/USGS public domain unless otherwise noted; see `DATA_SOURCES.md`.  
Basemap: USGS Astrogeology, Mars 2020 TRN HiRISE orthomosaic browse.

## Credits

See `CREDITS.md`.
```

---

## 3. `DATA_SOURCES.md`

Use this table. Add any new source before using it in the app.

| Dataset / source | Instrument / mission | Product / DOI | Resolution | Access | Use in JEI | Limitations |
|---|---|---|---|---|---|---|
| HiRISE RDR | HiRISE / MRO | PDS ODE; e.g. `ESP_036618_1985` | 0.25–0.5 m/px | PDS | Target context, outcrop mapping | Non-continuous; shadows; RED4 gaps |
| HiRISE DTM | HiRISE / MRO | `DTEEC_045994_1985_046060_1985_U01`; `DTEEC_002387_1985_003798_1985_A01` | ~1 m/px | PDS/USGS | Local slope and relief (future) | Partial coverage; stereo artifacts |
| CTX EDR | CTX / MRO | PDS ODE; e.g. `P04_002743_1987_XI_18N282W` | ~6 m/px | PDS | Regional context | Too coarse for boulder-scale claims |
| CRISM TRDR | CRISM / MRO | PDS ODE; e.g. `ato00053d60_01_if125s_trr3` | ~18 m/px, 544 bands | PDS | Mineral context | Targeted; archive ends 2022 |
| THEMIS IR | THEMIS / Odyssey | PDS/USGS | ~100 m/px | PDS | Regional thermal context | Not a local hazard map |
| MOLA | MOLA / MGS | PDS | ~463 m/px | PDS | Global elevation context | Too coarse for local slope |
| HRSC | HRSC / Mars Express | ESA/PDS | 12.5–25 m/px | ESA/PDS | Regional topography | Coarser than HiRISE DTM |
| SHARAD | SHARAD / MRO | PDS | 10–20 m along-track | PDS | Subsurface context | Not a surface hazard map |
| MEDA | MEDA / Mars 2020 | PDS Atmospheres | Point measurements | PDS | Environmental context | One point; not a forecast |
| Rover PLACES | Mars 2020 | PDS `best_interp.csv` | Daily positions | PDS | Traverse and route geometry | Not a human route |
| USGS geologic map | USGS | SIM 3464 | 1:75,000 | USGS | Unit context | 100–200 m offset from surface-operations CTX |
| USGS HiRISE browse | USGS | 1024 px browse | ~20 m/px | USGS | Demo basemap | Approximate alignment; not measurement-grade |
| Farley et al. 2020 | — | 10.1007/s11214-020-00762-y | — | DOI | Mission context | Not a target ranking |
| Farley et al. 2022 | — | 10.1126/science.abo2196 | — | DOI | Séítah/Máaz; alteration | Not a biosignature |
| Mangold et al. 2021 | — | 10.1126/science.abl4051 | — | DOI | Delta-lake; flood deposits | No boulder-size statistics in abstract |
| Hurowitz et al. 2025 | — | 10.1038/s41586-025-09413-0 | — | DOI | Bright Angel; potential biosignature | Not confirmed life; sample return needed |
| Horgan et al. 2020 | — | 10.1016/j.icarus.2019.113526 | — | DOI | Margin Unit carbonates | Lacustrine origin is a hypothesis |
| Stack et al. 2024 | — | 10.1029/2023JE008187 | — | DOI | Shenandoah stratigraphy | Facies interpretation, not life |
| Scheller et al. 2024 | — | 10.1126/sciadv.adm8241 | — | DOI | Counter-evidence for luminescence | Inorganic explanation is possible |
| Sun & Stack 2020 | — | 10.3133/sim3464 | — | DOI | Geologic map | 100–200 m offset |

**Rule:** if a source is not in this table or `app_data/sources.json`, it cannot appear in the app.

### 3.1 NASA resource directory

| Resource | Role in this project | Link |
|---|---|---|
| JPL Mars Trek | Design reference and optional “open in Mars Trek” context link; not an analysis data source | https://trek.nasa.gov/mars/ |
| USGS–NASA Planetary Geologic Mapping Program | Source of the Jezero geologic map (SIM 3464) | https://astrogeology.usgs.gov/ |
| Curiosity route map / flyover | Design reference for the route visual and waypoint labels | https://science.nasa.gov/resource/curiositys-proposed-path-up-mount-sharp/ |
| NASA Worldview | Earth-observation design reference; not a Mars dataset | https://worldview.earthdata.nasa.gov/ |
| Perseverance raw images | Future “what you will see” panel; not in the MVP | https://mars.nasa.gov/mars2020/multimedia/raw-images/ |

Do not scrape Mars Trek WMTS tiles into the app and present them as measurement data. If a Mars Trek link is added, label it “Open in Mars Trek (external context)” and keep it separate from the app’s data layers.

---

## 4. `METHODOLOGY.md`

### 4.1 Target selection

Targets were selected from published Jezero geology and rover observations, covering:

- crater-floor igneous rocks (Séítah, Máaz);
- the western delta and Shenandoah Formation;
- Neretva Vallis and Bright Angel;
- the carbonate-bearing Margin Unit;
- the western rim as context.

The target positions are approximate. They use PDS rover daily localizations as proxies and must be refined against HiRISE imagery and the rover operations target database.

### 4.2 Assessment dimensions

Each target is assessed on four separate dimensions:

1. **Habitability potential** — could the past environment have supported life?
2. **Biosignature evidence** — are observations consistent with biology, and how well are alternatives understood?
3. **Scientific value** — could the target improve understanding of geological history, mineral formation, or environmental evolution?
4. **Accessibility** — how difficult is it to reach and work at the target?

The levels are qualitative: High / Moderate / Low / Unknown, with compound values where the evidence is mixed. They are not probabilities and are not combined into a single score.

### 4.3 Evidence classes

Every claim is classified as:

- observation;
- published interpretation;
- hypothesis;
- public interpretation;
- counter-evidence.

The app displays the class, the instrument, the source, and the confidence.

### 4.4 Sorting

The objective selector changes the **sort order**, not the underlying assessments:

- Geological: science, then confidence.
- Habitability: habitability, then science.
- Biosignature: biosignature, then the number of biosignature evidence records, then confidence.
- Accessibility: access (Easy first), then distance.

Qualitative levels are mapped to ordinal weights **only for sorting**. The display never shows a numeric score.

### 4.5 Route

The route is a fixed segment of the rover’s daily-position track from sol 0 to sol 1196. It is not a human-rated route. The elevation profile comes from rover localization, not a HiRISE DTM. No slope-dependent speed, obstacle, boulder, dust, or communications model has been applied.

### 4.6 Uncertainty

The app shows:
- a confidence value for each target;
- the reason for that confidence;
- counter-evidence for biosignature claims;
- the basemap alignment caveat;
- the coordinate frame;
- the difference between measured, analogue, model, unknown, and assumption in the environment panel.

### 4.7 What the methodology does not do

- It does not confirm life.
- It does not certify a route.
- It does not predict local radiation.
- It does not establish shallow ice.
- It does not provide a statistically calibrated probability.

---

## 5. `CREDITS.md`

```markdown
# Credits

## Data and imagery

- NASA/JPL-Caltech/University of Arizona — HiRISE
- NASA/JPL-Caltech/Malin Space Science Systems — CTX
- NASA/JPL-Caltech/Johns Hopkins University Applied Physics Laboratory — CRISM
- NASA/JPL-Caltech/Arizona State University — THEMIS
- NASA/Goddard Space Flight Center — MOLA
- ESA/DLR/FU Berlin — HRSC
- NASA/JPL-Caltech/University of Rome — SHARAD
- NASA/JPL-Caltech/CSIC-INTA — MEDA
- NASA/JPL-Caltech — Mars 2020 Perseverance and the PDS Rover PLACES bundle
- USGS Astrogeology Science Center — Jezero geologic map and Mars 2020 TRN HiRISE orthomosaic browse

## Science papers

See `DATA_SOURCES.md` and `app_data/sources.json`.

## Software

- MapLibre GL JS
- React
- Vite
- Tailwind CSS
- Zustand
- Zod
- Lucide

## Basemap note

The demo basemap is a 1024 px browse image from the USGS Mars 2020 TRN HiRISE orthomosaic. It is approximately aligned and is not measurement-grade. The full-resolution product is linked in `app_data/manifest.json`.

## Image usage

NASA and USGS imagery are generally public domain; check the instrument team’s usage policy for commercial use. Do not imply NASA endorsement.
```

---

## 6. `DEMO_SCRIPT.md` (3 minutes)

### 0:00–0:20 — Open

“This is Jezero Expedition Intelligence. It is a science evidence atlas for a human exploration team, not a rover dashboard and not a global Mars map.”

Show the map with the nine targets and the rover traverse.

### 0:20–0:50 — The problem

“Jezero is data-rich, but the evidence is uneven. Some things are measured, some are interpreted, some are hypotheses, and some are unknown. A normal map collapses all of that into a pin. We don’t.”

Point to the status bar: planetocentric CRS, approximate basemap, planning-aid caveat.

### 0:50–1:40 — T7 Bright Angel

Select T7.

“This is the strongest biosignature candidate in the region. Organic-carbon-bearing mudstones, sub-millimetre Fe-phosphate nodules, millimetre-scale reaction fronts, likely vivianite and greigite. NASA called it a possible biosignature at the first CoLD level.”

Point to the four assessment cards.

“Habitability is high. Biosignature evidence is potential — not confirmed. Scientific value is high. Access is moderate. We keep those separate.”

Open the counter-evidence.

“Here is the competing explanation: luminescence signals that looked organic can be explained by inorganic Ce³⁺ in phosphate and silicate defects. And the paper itself says sample return is required. That is the level of honesty we want on the map.”

### 1:40–2:20 — T2 Séítah and the objective switch

Select T2.

“Séítah is a high-value igneous and alteration target. But its biosignature evidence is weak. If the crew’s objective is geological history, it ranks high. If the objective is biosignature, it does not.”

Switch the objective selector to Biosignature.

“The ranking changes. The underlying assessments do not. That is the difference between a science tool and a leaderboard.”

### 2:20–2:50 — Route

Turn on route mode.

“This is a fixed rover traverse segment: 23.3 km, 452 metres of ascent, 29.9% max grade. It is not a human-rated route. The elevation comes from rover localization, not a DTM. No obstacle, boulder, dust, or comms model has been applied.”

Show the profile.

“The crew can see the shape of the traverse and the assumptions. The map helps them plan; it does not certify safety.”

### 2:50–3:00 — Close

“No confirmed life. No safe-route claim. Just evidence, uncertainty, and a route a science team can argue about. That is Jezero Expedition Intelligence.”

---

## 7. `QA.md`

### 7.1 Content QA

- [ ] No text says “confirmed life,” “biosignature found,” “proof of life,” or “life on Mars confirmed.”
- [ ] T7 says “Potential biosignature — not confirmed evidence of life.”
- [ ] T7 says “likely vivianite and greigite,” not “confirmed.”
- [ ] T7 shows the Scheller et al. counter-evidence.
- [ ] Radiation card says “No local RAD measurement at Jezero.”
- [ ] Water-ice card says “not established.”
- [ ] Route says “not a human-rated route.”
- [ ] Status bar says “approximate alignment.”
- [ ] About panel contains the no-life statement.
- [ ] No boulder size or flood discharge is quoted.

### 7.2 Interaction QA

- [ ] Selecting a target in the list selects the map marker.
- [ ] Selecting a marker selects the list row.
- [ ] The objective selector reorders the list.
- [ ] Route mode toggles the route line and profile.
- [ ] Environment drawer opens/closes.
- [ ] About drawer opens/closes.
- [ ] Keyboard focus is visible.
- [ ] No console errors.

### 7.3 Visual QA

- [ ] 1440×900: three columns, no overlap.
- [ ] 1280×800: three columns, no horizontal scroll.
- [ ] 390×844: map + bottom sheet, no clipped text.
- [ ] Four assessment cards remain visible on mobile.
- [ ] Evidence cards do not overflow.
- [ ] Route profile is readable.
- [ ] Color is not the only signal for evidence class.

### 7.4 Technical QA

- [ ] `pnpm build` succeeds.
- [ ] `pnpm test` passes.
- [ ] `pnpm test:e2e` passes.
- [ ] `pnpm preview` works.
- [ ] No unused dependencies.
- [ ] No API keys.
- [ ] App works with the network disabled after load.
- [ ] Lighthouse performance ≥ 80 on desktop (optional target).

### 7.5 Data QA

- [ ] Every `source_ids` entry exists in `sources.json`.
- [ ] Every `target_id` in `evidence.json` exists in `targets.geojson`.
- [ ] Route summary matches `route.geojson`.
- [ ] Target count is 9.
- [ ] Evidence count is 14.
- [ ] Source count is 18.
- [ ] No JSON parse errors.

---

## 8. `RISKS.md`

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Basemap misalignment makes targets look wrong | High | High | Visible “approximate alignment” warning; full-resolution upgrade path; do not measure on the browse |
| Judges read “potential biosignature” as “life found” | Medium | High | Exact copy; counter-evidence; no-life statement in About and final slide |
| Route is read as a safe human route | Medium | High | “Rover traverse segment” label; assumptions; no safety badge |
| Data file missing at demo | Low | High | Static local data; `data:check`; offline test |
| MapLibre fails on the demo laptop | Low | Medium | Test in Chrome/Edge; fallback list view |
| Too much text on mobile | Medium | Medium | Bottom sheet; show four chips; progressive disclosure for evidence details |
| CRS confusion | Medium | High | Status bar; About section; no mixed frames |
| Time overrun | Medium | Medium | Phase gates; cut stretch goals; core demo first |
| Font/CDN failure | Low | Low | System fallback; local fonts if possible |
| Accessibility gaps | Medium | Medium | Keyboard test; contrast check; list alternative |

---

## 9. `JUDGING_MAP.md`

Use this as a guide, not a claim about the official rubric. Verify the 2026 rubric before submission.

| Criterion | What the app demonstrates | Where to show it |
|---|---|---|
| **Scientific validity** | Primary papers verified; evidence classes; counter-evidence; uncertainty; no overclaim | T7 evidence, About, methodology |
| **Use of NASA data** | HiRISE, CTX, CRISM, THEMIS, MOLA, MEDA, rover data, USGS map | Status bar, About, data provenance |
| **Creativity** | Evidence-first atlas; four separate assessments; counter-evidence visible | T7 and objective switch |
| **Impact** | Helps a crew prioritise science and understand terrain constraints | Route mode, target cards |
| **Technical execution** | Working static app; map; data validation; tests | Live demo, build |
| **Presentation** | Clear 3-minute story; strong visual hierarchy; honest caveats | Demo script, UI |
| **Challenge fit** | Local-scale Marswalk planning; layered data; route; safety caveats | Entire app |

---

## 10. `PITCH.md` (optional 60-second version)

“NASA has mapped Mars for decades, but the data is not layered for a human walking tour. Jezero Expedition Intelligence is a local-scale science atlas for Jezero Crater. It shows nine targets, four separate assessments, and the evidence behind each one. Our strongest target, Bright Angel, has organic-carbon mudstones and iron-phosphate nodules — a potential biosignature, not proof of life. The app shows the competing explanations and the sample-return requirement. It also shows a 23.3 km rover traverse with a 29.9% max grade, and says clearly that it is not a human-rated route. No confirmed life. No safe-route claim. Just evidence a crew can argue about.”

---

## 11. Screenshot set

Capture at 1440×900:

1. Map with all targets and the traverse.
2. T7 detail with the four assessments and the potential-biosignature banner.
3. T7 evidence with counter-evidence visible.
4. Objective selector switched to Biosignature, showing T7 first.
5. Route mode with the elevation profile.
6. Environment drawer with the radiation card.
7. About drawer with the no-life statement.
8. Mobile view at 390×844.

Name files `01_map.png`, `02_t7_detail.png`, etc. Use them in the submission page.

---

## 12. Submission checklist

- [ ] App runs locally and from `dist/`.
- [ ] README is complete.
- [ ] Data provenance table is complete.
- [ ] Credits and license are complete.
- [ ] Demo script is rehearsed.
- [ ] Screenshots are captured.
- [ ] No prohibited phrases.
- [ ] No confirmed-life claim.
- [ ] No safe-route claim.
- [ ] No local radiation claim.
- [ ] Basemap caveat visible.
- [ ] CRS visible.
- [ ] Source links work.
- [ ] Mobile view works.
- [ ] Video/demo link is ready.
- [ ] Team names and roles are listed.
- [ ] NASA Space Apps submission form is complete.

---

## 13. Final scientific statement

Use this exact statement in the submission, the About panel, and the final slide:

> The strongest scientific statement the data support is: Jezero was habitable, and Bright Angel preserves a potential biosignature that requires sample return to resolve. That is not the same as evidence of life.
