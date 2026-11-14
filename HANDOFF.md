# Handoff — how to run this with Antigravity

## 1. Give Antigravity the package

Unzip `Jezero_Antigravity_Package.zip` into a folder Antigravity can read. The folder contains:

- `00_MASTER_ANTIGRAVITY_PROMPT.md`
- `01_SYSTEM_ARCHITECTURE.md` through `07_PROJECT_REQUIRED_DOCUMENT.md`
- `app_data/` with the real Jezero JSON, GeoJSON, and basemap
- `BUILD_STATUS.md` template
- `README.md`

## 2. Start the session

Open Antigravity and paste the **entire contents** of `00_MASTER_ANTIGRAVITY_PROMPT.md` as the first message. Then attach or open the package folder so the agent can read the other files.

Do not paste only the first paragraph. The master prompt contains the build order, the non-negotiables, the acceptance criteria, and the final output format.

## 3. What to say if Antigravity asks questions

- **“Where is the data?”** → `app_data/`; copy it to `public/data/`.
- **“What should I build first?”** → the phases in `02_IMPLEMENTATION_PHASES.md`.
- **“Can I simplify the science?”** → no; read `03_SYSTEM_AND_OPERATIONAL_RULES.md`.
- **“Can I invent a slope layer?”** → no; there is no slope raster in the package. Omit it or mark it “data not loaded.”
- **“Can I generate a route?”** → no; use the fixed `R1` route.
- **“Can I say life was found?”** → no; T7 is a potential biosignature, not confirmed.

## 4. What to check when it finishes

1. `pnpm dev` runs at `http://localhost:5173`.
2. `pnpm build` succeeds.
3. `pnpm test` and `pnpm test:e2e` pass.
4. T7 shows **“Potential biosignature — not confirmed evidence of life.”**
5. T7 shows the counter-evidence.
6. Route mode shows **23.3 km**, **+452 m**, **−237 m**, **29.9%**, and **“not a human-rated route.”**
7. The status bar shows the CRS and **“Basemap: USGS HiRISE browse · approximate alignment.”**
8. The radiation card says **“No local RAD measurement at Jezero.”**
9. The water-ice card says **“not established.”**
10. The About panel contains the no-life statement.
11. The app works at 1440×900 and 390×844.

## 5. What to do if it gets stuck

Ask it to:

1. Read `03_SYSTEM_AND_OPERATIONAL_RULES.md` again.
2. Re-run the failing phase’s acceptance check.
3. Record the blocker in `BUILD_STATUS.md`.
4. Cut the feature, not the scientific rule.

The package is designed so that a missing layer becomes a visible “data not loaded” state, not a fabricated one.

## 6. What “done” looks like

A working static app, a 3-minute demo, and a `BUILD_STATUS.md` that is honest about what is real, what is simplified, and what is missing.

The final sentence of the demo should be:

> **Jezero was habitable. Bright Angel preserves a potential biosignature that requires sample return to resolve. That is not the same as evidence of life.**
