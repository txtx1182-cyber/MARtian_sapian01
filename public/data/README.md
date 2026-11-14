# app_data — field notes

This folder is the application’s read-only scientific dataset. Copy it to `public/data/` in the Vite project.

## Files

| File | What it is |
|---|---|
| `manifest.json` | App metadata, map bounds, basemap, layer list, data paths |
| `targets.geojson` | 9 target points with qualitative assessments and source IDs |
| `traverse.geojson` | Perseverance daily-position track, sols 0–1897 |
| `route.geojson` | Fixed route `R1`: landing → Séítah → delta front → Neretva → Bright Angel |
| `route_profile.json` | Route summary and elevation profile |
| `environment.json` | Radiation, atmosphere, terrain, water ice, mobility |
| `evidence.json` | 14 claim-level evidence records with counter-evidence |
| `sources.json` | 18 sources with DOI/URL |
| `basemap_jezero_1024.jpg` | USGS HiRISE orthomosaic browse image, 1024 px |

## Coordinate conventions

- All coordinates are **planetocentric**, positive east, in degrees.
- GeoJSON coordinate order is `[longitude, latitude, elevation_m]`.
- The working CRS is `Mars 2000 planetocentric, equirectangular, positive east`.
- The basemap image footprint is approximate; do not use it for measurement.

## Assessment values

The values are **qualitative strings**, not numbers:

- Habitability: `High`, `Moderate`, `Low`, `Unknown`, or a compound such as `Low–Moderate`.
- Biosignature: `Potential`, `Weak`, `None documented`, `Unknown`, or a qualified string.
- Science: `High`, `Moderate`, `Low`.
- Access: `Easy`, `Moderate`, `Difficult`, `Unknown`.
- Confidence: `High`, `Moderate`, `Low`, or a compound.

Each target also includes `confidence_reason`, a one-sentence explanation to display under the confidence badge.

Do not coerce these to numbers in the data layer. If sorting needs an ordinal, parse the highest token in `src/lib/sort.ts` and keep the display string unchanged.

## Route numbers

`route.geojson` and `route_profile.json` both report:

- distance 23.3 km
- ascent 452.3 m
- descent 236.8 m
- max grade 29.9%
- min grade −20.7%
- elevation range −2585.9 m to −2349.3 m

These are from the rover daily-position track, not a HiRISE DTM, and not a human-rated route.

## Basemap

- Source: USGS Astrogeology, Mars 2020 TRN HiRISE orthorectified image mosaic (browse).
- Full-resolution product: 6.9 GB GeoTIFF, linked in `manifest.json`.
- Browse image is approximately aligned; the app must disclose this.
- If the full GeoTIFF is cropped and aligned, update `manifest.json`:
  - `basemap.image`
  - `basemap.bounds`
  - `basemap.resolution_m`
  - `basemap.alignment` (only set to `verified` after checking targets against the image)

## Adding data

If you add a new target or evidence record:

1. Add the source to `sources.json`.
2. Add the target to `targets.geojson` with a unique `id`.
3. Add evidence with a matching `target_id` and `source_ids`.
4. Update the counts in the docs if they are asserted.
5. Run `pnpm data:check` (if the validation script exists).

Do not invent coordinates, observations, or source IDs.
