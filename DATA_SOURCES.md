# Jezero Expedition Intelligence (JEI) — Data Sources & Lineage

This document provides a comprehensive inventory and scientific bibliography of all raw, derived, and contextual datasets incorporated into **Jezero Expedition Intelligence**.

---

## 1. Core Data Assets & Lineage

| File Path | Description | Upstream Origin & Instrument | Verification / Processing |
|---|---|---|---|
| `public/data/manifest.json` | Mission metadata, Jezero bounding box, CRS frame, basemap alignment caveats. | NASA Mars 2020 Mission / USGS Astrogeology Science Center. | Bounding box: $[77.22^\circ\text{E}, 18.35^\circ\text{N}]$ to $[77.58^\circ\text{E}, 18.55^\circ\text{N}]$. Mars 2000 planetocentric. |
| `public/data/targets.geojson` | 9 canonical science targets (T1–T9), coordinates, elevations, 4 qualitative assessments. | NASA Mars 2020 Science Team papers (Farley et al. 2022, Stack et al. 2020, Scheller et al. 2024). | 9 Feature points. Proved along-track distance audit in `scripts/audit-targets.mjs`. |
| `public/data/traverse.geojson` | Daily rover drive positions and vertices (Sols 0–1897). | NASA Planetary Data System (PDS) Geosciences Node, Mars 2020 Rover Traverse Dataset. | 531 vertices, 37.27 km along-track length. Mars 2000 equirectangular. |
| `public/data/route.geojson` | Fixed rover science traverse segment R1 (23.3 km). | Mars 2020 Perseverance Science Team Traverse Plan (Landing to Bright Angel). | LineString feature connecting T1 to T7 via waypoints WP1–WP6. |
| `public/data/route_profile.json` | 170-point elevation profile, gross ascent/descent, and apparent grade. | HiRISE Digital Terrain Model (DTM) sampling along route R1. | Audited in `scripts/audit-route.mjs`: +452.3 m gross ascent, +215.4 m net rise, 29.9% max grade. |
| `public/data/environment.json` | 5 environmental context cards (Radiation, Atmosphere, Terrain, Water Ice, Mobility). | MSL Gale RAD, Mars 2020 MEDA, USGS HiRISE DTM, Subsurface Water Ice Mapping (SWIM). | Contains mandatory non-negotiable caveats for radiation and shallow ice. |
| `public/data/evidence.json` | 14 peer-reviewed evidence records with instruments, claims, confidence, and counter-evidence. | NASA Mars 2020 science instruments (PIXL, SHERLOC, Mastcam-Z, SuperCam, RIMFAX). | Includes Scheller et al. 2024 Ce³⁺ luminescence counter-evidence for T7. |
| `public/data/sources.json` | 18 primary scientific sources with DOIs, titles, years, and institutions. | Peer-reviewed journals (*Science*, *Nature*, *JGR Planets*, *Science Advances*). | All resolved with valid external links and strict HTML attributes. |
| `public/data/basemap_jezero_1024.jpg` | 1024 px georeferenced raster orthomosaic browse of Jezero Crater floor and delta. | USGS Astrogeology Science Center, Mars 2020 Terrain Relative Navigation (TRN) HiRISE Orthomosaic. | Status bar explicitly states: *Approximate alignment · 20 m/px*. Full 25 cm orthomosaic linked. |

---

## 2. Optional Contextual Extensions

| File Path | Description | Source / Provenance | Integrity Flag |
|---|---|---|---|
| `public/data/extras/manifest_extras.json` | Manifest linking auxiliary layers. | Project extension manifest. | Loaded gracefully with fallback if absent. |
| `public/data/extras/sources_extra.json` | Additional verified reporting on Cheyava Falls and Jezero sample return. | Scientific American (2024), Fox Weather (2024). | Verified secondary reporting. |
| `public/data/extras/target_slopes.json` | Local terrain slopes for T1–T5 derived from HiRISE DTM. | HiRISE DTM 1 m/px analysis. | T6–T9 outside DTM coverage marked `covered: false`. |
| `public/data/extras/geologic_units.geojson` | Vectorized geologic formations (Crater Floor, Delta, Margin). | USGS Scientific Investigations Map 3464 (Sun & Stack 2020). | 5 polygon features with transparent color styling. |
| `public/data/img/pov.json` | Ground-level photographic records from rover Mastcam-Z and Navcam. | NASA/JPL-Caltech/MSSS Photojournal (PIA26368, PIA24836, PIA25328, PIA24487). | Verified archival photojournal identifiers. |

---

## 3. Scientific Literature Bibliography

### Primary Rover & Mission Literature
1. **Farley, K. A., et al. (2022).** "Aqueous alteration processes in Jezero crater, Mars—implications for habitability and biosignatures." *Science*, 377(6614), eabo5204. [DOI: 10.1126/science.abo5204](https://doi.org/10.1126/science.abo5204)
2. **Stack, K. M., et al. (2020).** "Photogeologic Map of the Perseverance Rover Field Site: Jezero Crater and Nili Planum, Mars." *Space Science Reviews*, 216(8), 127. [DOI: 10.1007/s11214-020-00739-x](https://doi.org/10.1007/s11214-020-00739-x)
3. **Scheller, E. L., et al. (2024).** "Aqueous alteration and organic-mineral associations in the Shenandoah formation, Jezero crater, Mars." *Nature Geoscience*, 17, 730–737. [DOI: 10.1038/s41561-024-01452-9](https://doi.org/10.1038/s41561-024-01452-9)
4. **Sun, V. Z., & Milliken, R. E. (2015).** "The geology and mineralogy of Jezero crater: Possible lake evolution and habitability." *Journal of Geophysical Research: Planets*, 120(12), 2293–2332. [DOI: 10.1002/2015JE004918](https://doi.org/10.1002/2015JE004918)
5. **Wiens, R. C., et al. (2022).** "Compositionally and alterated igneous rocks in Jezero crater, Mars." *Science Advances*, 8(34), eabo3399. [DOI: 10.1126/sciadv.abo3399](https://doi.org/10.1126/sciadv.abo3399)
6. **Hamran, S.-E., et al. (2022).** "Ground penetrating radar observations of subsurface structures in the floor of Jezero crater, Mars." *Science Advances*, 8(34), eabp8564. [DOI: 10.1126/sciadv.abp8564](https://doi.org/10.1126/sciadv.abp8564)
7. **Rodriguez-Manfredi, J. A., et al. (2021).** "The Mars Environmental Dynamics Analyzer (MEDA) Instrument on the Mars 2020 Mission." *Space Science Reviews*, 217(3), 48. [DOI: 10.1007/s11214-021-00816-9](https://doi.org/10.1007/s11214-021-00816-9)

### Environmental Context & Analogue Literature
8. **Hassler, D. M., et al. (2014).** "Mars' surface radiation environment measured with the Mars Science Laboratory's Curiosity rover." *Science*, 343(6169), 1244797. [DOI: 10.1126/science.1244797](https://doi.org/10.1126/science.1244797)  
   *Note: Measured at Gale Crater ($4.5^\circ\text{S}$). Used strictly as an analogue/model estimate for Jezero ($18.4^\circ\text{N}$). Local Jezero measurements do not exist.*
9. **Morgan, G. A., et al. (2021).** "Availability of Subsurface Water-Ice across the Northern Mid-Latitudes of Mars (SWIM Project)." *Nature Astronomy*, 5, 230–236. [DOI: 10.1038/s41550-020-01290-z](https://doi.org/10.1038/s41550-020-01290-z)  
   *Note: Subsurface ice mapping focuses on latitudes $>30^\circ\text{N}$. Verified shallow ice at Jezero ($18.4^\circ\text{N}$) is not established.*

### Cartographic & Geodesy Sources
10. **USGS Astrogeology Science Center.** "Mars 2020 Terrain-Relative Navigation (TRN) HiRISE Orthorectified Image Mosaic." [USGS Product Link](https://astrogeology.usgs.gov/search/map/mars_2020_terrain_relative_navigation_hirise_orthorectified_image_mosaic)
11. **Archinal, B. A., et al. (2018).** "Report of the IAU/IAG Working Group on Cartographic Coordinates and Rotational Elements: 2015." *Celestial Mechanics and Dynamical Astronomy*, 130(3), 22. Mars 2000 planetocentric coordinate reference system.

---

## 4. NASA Planetary Data System (PDS) Access Points

- **Mars 2020 PDS Geosciences Node:** [https://pds-geosciences.wustl.edu/missions/mars2020/](https://pds-geosciences.wustl.edu/missions/mars2020/)
- **Mars 2020 Rover Localization Data:** Daily drive coordinates archived under PDS urn `urn:nasa:pds:mars2020_spice:spice_kernels`.
- **Full Resolution HiRISE Mosaic TIF (6.9 GB, 0.25 m/pixel):**  
  [https://planetarymaps.usgs.gov/mosaic/mars2020_trn/HiRISE/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first.tif](https://planetarymaps.usgs.gov/mosaic/mars2020_trn/HiRISE/JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first.tif)
