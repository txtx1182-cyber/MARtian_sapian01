# 05 — Project Context and Memory

This file is the project’s long-term memory. Read it before making product decisions. If a later instruction conflicts with this file, the scientific-integrity rules in `03_SYSTEM_AND_OPERATIONAL_RULES.md` win.

---

## 1. The mission

**Challenge:** NASA Space Apps Challenge 2026 — Challenge 11, *Interplanetary Survival Guide: Martian Map*.

The challenge asks for a layered, integrated view of a location or route on Mars that could help a human explorer plan and carry out a successful Marswalk while conducting science. NASA’s priorities are astronaut safety and useful science. The map may be static or interactive, and may use data from multiple NASA missions.

**Our answer:** a local-scale, evidence-first atlas of Jezero Crater, with a fixed science traverse and a strong separation between habitability, biosignature evidence, scientific value, and accessibility.

**Why Jezero:** it combines an ancient lake and river-delta setting, sedimentary deposits, igneous crater-floor rocks, carbonate-bearing units, clay and altered minerals, dense orbital coverage, and extensive Perseverance rover observations. It is one of the best-documented Places on Mars for a science-driven map.

**Why not a global map:** Jezero has the data density and the scientific narrative. A global map would be visually impressive but would force the team to make claims at a scale the data cannot support.

---

## 2. Users and jobs

### Primary user: the mission science planner

They need to know:
- which targets are worth the traverse;
- why a target matters;
- how strong the evidence is;
- what could disprove the interpretation;
- how hard the terrain is;
- what data is missing.

### Secondary user: the astronaut / field scientist

They need:
- a clear map with target markers;
- a route profile with distance, ascent, and max grade;
- plain-language evidence cards;
- a visible “not a safety certification” caveat;
- a way to see what they will find at the target.

### Tertiary user: the judge / evaluator

They need:
- a clear scientific story;
- visible use of NASA data;
- a credible treatment of uncertainty;
- a polished, working demo;
- a reason to believe the team understood the challenge.

---

## 3. The scientific position

Jezero preserves a record of ancient water, sedimentary deposition, igneous differentiation, and post-depositional alteration.

The western delta and Neretva Vallis are the strongest sedimentary and habitability targets. Bright Angel / Cheyava Falls contains organic-carbon-bearing mudstones with Fe-phosphate and Fe-sulfide nodules and reaction fronts that may record low-temperature redox processes involving organic matter.

Those observations are a **potential biosignature**, not evidence of life. The 2025 *Nature* study explicitly requires returned-sample analysis to determine the origin of the minerals, organics, and textures. Alternative abiotic explanations remain possible, and at least one earlier luminescence signal in Jezero was re-interpreted as inorganic.

**The correct posture:** high-priority target, strong observations, unresolved interpretation, sample return required.

**The correct map posture:** help a crew plan, not certify safety.

---

## 4. The four core papers

| Paper | What it gives us | What it does not give us |
|---|---|---|
| **Farley et al. (2020), Mars 2020 Mission Overview** | Mission architecture, objectives, instruments, sampling strategy | A geological ranking of Jezero targets |
| **Farley et al. (2022), Aqueously altered igneous rocks** | Séítah olivine cumulate; Máaz igneous unit; Mg–Fe grain-boundary carbonates; sulfates/perchlorates in voids; cached cores | Evidence that the floor is sedimentary or the best biosignature host |
| **Mangold et al. (2021), Ancient delta-lake system** | Inclined delta strata; boulder conglomerates; transition from persistent lake to short energetic floods | Boulder-size statistics or flood discharge in the abstract |
| **Hurowitz et al. (2025), Redox-driven associations** | Bright Angel organic-carbon mudstones; sub-mm Fe-phosphate nodules; mm-scale reaction fronts; likely vivianite and greigite; low-temperature redox; sample return needed | Confirmation of life; a resolved organic source; a confirmed mineral identification |

**Verification corrections**

- Do not quote a boulder size from Mangold et al. (2021) until the full text is checked.
- “Likely vivianite and greigite” is not “confirmed vivianite and greigite.”
- The Farley grain-boundary carbonates are not the same as the orbital Margin Unit carbonates.

---

## 5. The target register

These are the nine targets in `app_data/targets.geojson`. Positions are approximate and use planetocentric coordinates. The nearest rover sol is a proxy, not a survey-grade target coordinate.

| ID | Target | Position | Habitability | Biosignature | Science | Access | Confidence |
|---|---|---|---|---|---|---|---|
| T1 | Octavia E. Butler Landing | 18.4446°N, 77.4509°E, −2569.9 m | Low–Moderate | None documented | Moderate | Easy | High |
| T2 | Séítah | 18.4325°N, 77.4407°E, −2571.8 m | Moderate | Weak / none documented | High | Easy | Moderate |
| T3 | Máaz | 18.4619°N, 77.4361°E, −2555.2 m | Low–Moderate | None documented | Moderate | Easy | Moderate |
| T4 | Western delta front / Shenandoah | 18.4827°N, 77.3686°E, −2421.1 m | High (interpreted) | Potential | High | Moderate | Moderate |
| T5 | Upper delta / Cape Nukshak | 18.4954°N, 77.3466°E, −2398.5 m | High (interpreted) | Potential | High | Difficult | Moderate |
| T6 | Neretva Vallis entry | 18.4961°N, 77.3038°E, −2362.8 m | High (interpreted) | Potential | High | Moderate | Moderate |
| T7 | Bright Angel / Cheyava Falls | 18.4974°N, 77.3051°E, −2354.5 m | High (interpreted) | **Potential (highest documented, not confirmed)** | High | Moderate | Moderate–Low |
| T8 | Margin Unit / Mandu Wall | 18.4606°N, 77.2647°E, −1820.0 m | Moderate–High (hypothesis) | Potential / Unknown | High | Difficult | Low–Moderate |
| T9 | Western rim traverse | 18.4220°N, 77.2207°E, −1973.6 m | Unknown | Unknown | High | Difficult | Low |

**Key caution:** T7 is the strongest biosignature candidate, but “strongest candidate” is not “confirmed.” T2 is scientifically important for igneous and alteration history, but it is not the best biosignature host. T8 is a high-value orbital hypothesis with limited ground truth.

---

## 6. The route

The app uses one fixed route, `R1`:

**Landing → Séítah → Delta front → Neretva → Bright Angel**

- Distance: **23.3 km**
- Ascent: **+452 m**
- Descent: **−237 m**
- Max grade: **29.9%**
- Min grade: **−20.7%**
- Elevation range: **−2585.9 m to −2349.3 m**

It follows the rover’s daily positions from sol 0 to sol 1196. It is a scientifically relevant transect, **not a human-rated route**. The elevation values come from rover localization, **not a HiRISE DTM**. No slope-dependent speed model, obstacle model, boulder model, dust model, or communications model has been applied.

**Do not** generate a new route at runtime. **Do not** present the route as safe.

---

## 7. The data audit

A 1° × 1° PDS ODE query around Jezero returned:

| Dataset | Count | Note |
|---|---:|---|
| HiRISE RDRV11 | 359 | Map-projected image records; dense but not continuous |
| HiRISE DTM | 12 | Stereo DTMs; key products cover landing area and delta |
| CTX EDR | 309 | Regional context; near-complete |
| CRISM TRDR | 1,878 | Product records; targeted; archive ends May 2022 |

**Key products**

- HiRISE DTM `DTEEC_045994_1985_046060_1985_U01` — landing area, ~1 m/px.
- HiRISE DTM `DTEEC_002387_1985_003798_1985_A01` — delta fan, ~1 m/px.
- HiRISE images `ESP_036618_1985`, `ESP_055211_1985`, `ESP_058930_1985`, `ESP_088272_1985`.
- CRISM `ato00053d60_01_if125s_trr3`, `msv0005055b_01_if150s_trr3`, `msv0005079b_01_if150s_trr3`.
- CTX `P04_002743_1987_XI_18N282W`, `G13_023102_1986_XN_18N282W`.
- MEDA bundle: ~10 GB calibrated, ~2.9 GB derived, ~35 GB SkyCam.

**What is missing**

- A seamless, boulder-resolved orthomosaic of the entire corridor.
- A HiRISE DTM for the Bright Angel valley floor.
- A CRISM observation that uniquely resolves the Cheyava Falls outcrop.
- A local radiation measurement at Jezero.
- A proven shallow water-ice resource at Jezero.
- A validated human mobility model.
- Scientifically justified ranking weights.

### 7.1 NASA resource directory: what is used, what is not

| Resource | Use in JEI | Status |
|---|---|---|
| **JPL Mars Trek** | Design reference for a layered planetary map; optional “Open in Mars Trek” link for context. Not a data source for the app, because WMTS tiles do not carry per-pixel provenance. | Reference only |
| **USGS–NASA Planetary Geologic Mapping Program** | USGS SIM 3464 for unit context and contacts. Carries a documented 100–200 m offset from the surface-operations CTX mosaic. | Used for context |
| **Curiosity route map / flyover** | Visual reference for route styling, waypoint labels, and the “annotated route” idea. Not a Mars dataset. | Design reference |
| **NASA Worldview** | Earth-observation design reference for layered time-based exploration. It is not a Mars surface dataset. | Not used |
| **Perseverance raw images gallery** | Future “what you will see at the target” panel; not in the MVP because target-linking and image selection need curation. | Future extension |

**Rule:** these resources are design references unless their data is explicitly added to `app_data` with provenance. Do not scrape Mars Trek tiles into the app and present them as analysis data.

---

## 8. Coordinate and precision decisions

1. **Working frame:** Mars 2000 planetocentric, equirectangular, positive east.
2. **Why:** the PDS rover localization and the target register use planetocentric coordinates. The app displays this frame in the status bar.
3. **Planetocentric vs planetodetic:** at the landing site, the difference is **0.0984°**, about **5.8 km**. Do not mix frames silently.
4. **USGS map offset:** the USGS geologic map has a documented **100–200 m** offset from the surface-operations CTX mosaic. Use it for unit context only.
5. **Basemap alignment:** the provided 1024 px USGS HiRISE browse is approximately aligned. The app must disclose this. Do not use it for measurement.
6. **Native resolution:** show the basemap resolution (20 m/px browse; 0.25 m/px full product) and the route profile’s elevation source.

---

## 9. Product decisions (already made)

These are settled. Do not re-litigate them during the build.

| Decision | Rationale |
|---|---|
| Local-scale app, not global Mars | Data density and scientific defensibility |
| Nine targets, not hundreds | Quality of evidence over quantity |
| Four assessments, no composite score | The challenge requires separating habitability, biosignature, science, and access |
| Fixed route `R1`, no pathfinding | Avoid fake routing and false safety claims |
| Static data, no backend | Reliability, speed, no API keys |
| MapLibre + image basemap | Fast, local, works without a tile server |
| Qualitative labels, no percentages | Avoid false precision |
| Counter-evidence visible by default | Scientific integrity |
| “Potential biosignature” language | Required by the source |
| No local radiation claim | No RAD at Jezero |
| No shallow ice claim | Not established at Jezero |

---

## 10. Assumptions (label them in the UI)

- The rover traverse geometry is a reasonable proxy for a science transect, **not** a human route.
- The route’s elevation values are from rover localization, **not** a DTM.
- The map’s browse basemap is approximately aligned.
- The human mobility numbers (1.5 km/h walking, 4 h EVA) are design assumptions, not NASA-validated capabilities.
- The target positions are approximate; the nearest rover sol is a proxy.
- The “access” assessment is a first-order qualitative judgment, not a trafficability model.
- The app’s environmental panel is context, not a forecast.

---

## 11. Open questions

1. Does a HiRISE stereo pair / DTM exist for the Bright Angel valley floor? If not, label the gap.
2. Can the full-resolution USGS HiRISE GeoTIFF be cropped to the map bounds for a sharper basemap?
3. Can a CRISM footprint be matched to the Cheyava Falls outcrop, or is the scale mismatch too large?
4. What is the best available local radiation analogue for Jezero: Gale RAD, a model, or both?
5. Can a simple, transparent human mobility model be added without implying certification?
6. Is there a public rover operations target database with more precise coordinates for T7?
7. Should the app include a second route for a “habitability-first” objective?
8. What is the minimum set of MEDA time-series data needed for a useful atmosphere panel?

These are future work. Do not block the build on them.

---

## 12. Glossary

| Term | Meaning |
|---|---|
| **Jezero Crater** | A ~45 km impact crater on Mars at about 18.4°N, 77.5°E, with an ancient lake and delta system. |
| **Séítah** | Olivine-rich igneous formation on the crater floor, interpreted as a cumulate. |
| **Máaz** | Igneous unit overlying Séítah, interpreted as lava flows or a layered body. |
| **Shenandoah Formation** | Sedimentary sequence in the western fan, with mudstone, sandstone, and conglomerate. |
| **Bright Angel formation** | Mudstone and conglomerate outcrops along Neretva Vallis; host of the Cheyava Falls observations. |
| **Cheyava Falls** | A rock target in Bright Angel with organic-carbon-bearing mudstone, Fe-phosphate nodules, and reaction fronts. |
| **Margin Unit** | Carbonate-bearing unit along the inner crater rim; possible lacustrine carbonates. |
| **HiRISE** | High Resolution Imaging Science Experiment on MRO; 0.25–0.5 m/px images and ~1 m/px DTMs. |
| **CTX** | Context Camera on MRO; ~6 m/px regional imagery. |
| **CRISM** | Compact Reconnaissance Imaging Spectrometer for Mars; ~18 m/px, 544 bands. |
| **THEMIS** | Thermal Emission Imaging System on Mars Odyssey; ~100 m/px IR. |
| **MOLA** | Mars Orbiter Laser Altimeter; ~463 m/px global topography. |
| **DTM** | Digital Terrain Model; a raster of elevation. |
| **Planetocentric latitude** | Latitude measured from the center of the planet; used by PDS rover localization. |
| **Planetodetic latitude** | Latitude defined relative to an ellipsoid; differs from planetocentric. |
| **Biosignature** | A feature that may be evidence of past or present life, but is not proof by itself. |
| **Habitability** | The potential of an environment to support life, not evidence that life existed. |
| **CoLD scale** | Confidence of Life Detection scale; level 1 is a possible signal, not a confirmation. |
| **Vivianite** | A hydrated ferrous iron phosphate mineral; here “likely,” not confirmed. |
| **Greigite** | An iron sulfide mineral; here “likely,” not confirmed. |
| **Rover traverse** | The path the rover actually drove; not a human-rated route. |

---

## 13. File map

| File | Contents |
|---|---|
| `00_MASTER_ANTIGRAVITY_PROMPT.md` | The master prompt for the coding agent |
| `01_SYSTEM_ARCHITECTURE.md` | Architecture, contracts, file structure |
| `02_IMPLEMENTATION_PHASES.md` | Build order, acceptance criteria |
| `03_SYSTEM_AND_OPERATIONAL_RULES.md` | Non-negotiable rules |
| `04_VISUAL_DESIGN_UI_UX.md` | Design system, layout, copy |
| `05_PROJECT_CONTEXT_AND_MEMORY.md` | This file |
| `06_TECH_STACK.md` | Stack, dependencies, scripts |
| `07_PROJECT_REQUIRED_DOCUMENT.md` | Submission pack, QA, judging map |
| `app_data/manifest.json` | App metadata and data paths |
| `app_data/targets.geojson` | Nine targets |
| `app_data/traverse.geojson` | Rover daily track |
| `app_data/route.geojson` | Fixed route `R1` |
| `app_data/route_profile.json` | Route summary and profile |
| `app_data/environment.json` | Environment cards |
| `app_data/evidence.json` | Evidence records |
| `app_data/sources.json` | Sources |
| `app_data/basemap_jezero_1024.jpg` | USGS HiRISE browse |

---

## 14. Memory rules for the agent

1. **Do not invent scientific data.** If a value is not in `app_data`, it does not go in the UI.
2. **Do not change the target assessments.** They are qualitative research outputs, not design placeholders.
3. **Do not add a fifth assessment or a composite score.**
4. **Do not remove the counter-evidence from T7.**
5. **Do not change “Potential” to “Confirmed.”**
6. **Do not call the route safe.**
7. **Do not claim a local radiation measurement.**
8. **Do not claim shallow ice at Jezero.**
9. **Do not replace the basemap warning with a clean “verified” badge.**
10. **If a requirement is ambiguous, prefer the more cautious scientific interpretation and record the decision in `BUILD_STATUS.md`.**
