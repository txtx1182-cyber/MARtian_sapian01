# 06 — Tech Stack

## 1. Stack summary

| Layer | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast, static, simple; no server needed |
| UI | **React + TypeScript** | Component model, typed data contracts |
| Styling | **Tailwind CSS** + CSS variables | Fast iteration, consistent tokens |
| Map | **MapLibre GL JS** | Open-source, GPU-accelerated, supports image + GeoJSON sources |
| State | **Zustand** | Small, simple, no provider tree |
| Validation | **Zod** | Runtime validation of JSON/GeoJSON |
| Icons | **lucide-react** | Lightweight, consistent |
| Class utilities | **clsx** + **tailwind-merge** | Conditional classes without conflicts |
| Tests | **Vitest + Testing Library + Playwright** | Unit, component, and E2E |
| Data prep | **Python 3.11 + pandas** (already used) | Generated the provided `app_data` |
| Deployment | **Static hosting** (Vercel/Netlify/GitHub Pages) | No backend |

**Do not add:** Next.js, a backend framework, a database, a 3D globe, a heavy chart library, a component library that ships its own design system, or a runtime NASA API client.

## 2. Versions

Use the latest stable major at install time. The following are the recommended majors; do not downgrade unless a compatibility issue is proven.

| Package | Major |
|---|---|
| Node.js | 20 LTS or 22 LTS |
| pnpm | 9 or 10 |
| Vite | 6 or 7 |
| React | 19 |
| TypeScript | 5.x |
| Tailwind CSS | 3.4 (stable, well-documented) |
| MapLibre GL JS | 5.x |
| Zustand | 5.x |
| Zod | 3.x or 4.x |
| Vitest | 2.x or 3.x |
| Playwright | 1.x |

If Tailwind 4 is used instead, use `@tailwindcss/vite` and the v4 CSS-first config. Do not mix v3 and v4 config styles.

## 3. Install

```bash
pnpm create vite jezero-expedition-intelligence --template react-ts
cd jezero-expedition-intelligence
pnpm install
pnpm add maplibre-gl zustand clsx tailwind-merge lucide-react zod
pnpm add -D tailwindcss@3.4.17 postcss autoprefixer vitest @testing-library/react @testing-library/jest-dom jsdom playwright
pnpm exec tailwindcss init -p
pnpm exec playwright install chromium
```

Copy the data:

```bash
mkdir -p public/data
cp -r ../app_data/* public/data/
```

Verify:

```bash
ls public/data
# manifest.json targets.geojson traverse.geojson route.geojson route_profile.json
# environment.json evidence.json sources.json basemap_jezero_1024.jpg
```

## 4. `package.json` scripts

```json
{
  "name": "jezero-expedition-intelligence",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . --max-warnings 0",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "data:check": "node scripts/validate-data.mjs",
    "data:copy": "node scripts/copy-data.mjs"
  }
}
```

If ESLint is not configured by the Vite template, add it or remove the `lint` script. Do not leave a script that fails because the config is missing.

## 5. `vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    target: "es2020",
    sourcemap: false
  },
  server: {
    port: 5173,
    host: true
  }
});
```

`base: "./"` makes the static build portable to a subpath. If deploying to a domain root, `"/"` is also fine.

## 6. Tailwind and tokens

`tailwind.config.ts`:

```ts
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        border: "var(--border)",
        text: "var(--text)",
        muted: "var(--text-muted)",
        dim: "var(--text-dim)",
        accent: "var(--accent)",
        cyan: "var(--cyan)",
        violet: "var(--violet)",
        danger: "var(--red)",
        success: "var(--green)"
      },
      fontFamily: {
        display: ["Space Grotesk", "ui-sans-serif", "system-ui", "sans-serif"],
        body: ["IBM Plex Sans", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;
```

`src/styles/tokens.css`:

```css
:root {
  --bg: #0b0f14;
  --surface: #111821;
  --surface-2: #16212c;
  --border: #24303d;
  --text: #e8eef5;
  --text-muted: #93a4b8;
  --text-dim: #6b7c90;
  --accent: #f2a33a;
  --accent-soft: #3a2a16;
  --cyan: #5cc8d7;
  --cyan-soft: #123039;
  --violet: #a78bfa;
  --red: #e05d5d;
  --red-soft: #3a1a1a;
  --green: #6fcf97;
  --green-soft: #143024;
}
```

Import in `src/main.tsx`:

```ts
import "maplibre-gl/dist/maplibre-gl.css";
import "./styles/tokens.css";
import "./styles/globals.css";
```

## 7. Fonts

Preferred: load Space Grotesk and IBM Plex Sans/Mono from a local `public/fonts/` folder, not a third-party CDN. If the fonts are not available, use the system fallback. Do not block rendering on font load.

If Google Fonts is used for the demo, add `<link rel="preconnect">` and `display=swap`. The app must still be readable offline.

## 8. MapLibre setup

- Import `maplibre-gl/dist/maplibre-gl.css`.
- Create the map in a `useEffect` with a `ref`.
- Clean up with `map.remove()` on unmount.
- Do not recreate the map when selection changes; update sources/layers.
- Use `map.on("load", ...)` before adding sources/layers that depend on style.
- Use `map.setFeatureState` for selection instead of replacing the whole GeoJSON source.
- Use `map.fitBounds` with padding; do not use a fixed center/zoom that breaks at different aspect ratios.

### Image source corners

```ts
coordinates: [
  [77.22, 18.55], // top-left
  [77.58, 18.55], // top-right
  [77.58, 18.35], // bottom-right
  [77.22, 18.35]  // bottom-left
]
```

### Target layers

Use `circle` + `symbol` layers. Example:

```ts
map.addLayer({
  id: "targets",
  type: "circle",
  source: "targets",
  paint: {
    "circle-radius": 9,
    "circle-color": "#0b0f14",
    "circle-stroke-width": 2.5,
    "circle-stroke-color": "#f2a33a"
  }
});
```

A selected ring layer can filter on `["==", ["get", "id"], selectedId]` or use feature-state.

### Attribution

MapLibre’s default attribution control should be disabled and replaced with a custom attribution in the About panel and status bar. Keep the USGS/NASA credit visible.

## 9. Data loading and validation

Use `fetch` with `cache: "no-store"` in development and default cache in production. Validate with Zod:

```ts
const TargetProperties = z.object({
  id: z.string(),
  code: z.string(),
  name: z.string(),
  elevation_m: z.number(),
  unit: z.string(),
  context: z.string(),
  summary: z.string(),
  habitability: z.string(),
  biosignature: z.string(),
  science: z.string(),
  access: z.string(),
  confidence: z.string(),
  confidence_reason: z.string(),
  source_ids: z.array(z.string()),
  distance_from_landing_km: z.number(),
  nearest_rover_sol: z.number(),
  coordinate_note: z.string()
});
```

Do not use `z.enum` for the assessment strings; they include compound values.

## 10. State

Use Zustand. Keep it small. Do not put fetched data in the store; load it once in `App.tsx` and pass it down, or keep it in a separate `data` store that never changes. The UI store only holds selection, objective, layers, and drawer state.

## 11. Styling

- Use Tailwind for layout and spacing.
- Use CSS variables for color and typography tokens.
- Use `clsx` + `tailwind-merge` for conditional classes.
- Avoid inline styles except for dynamic map/chart geometry.
- Do not use a component library that overrides the design system. If a primitive is needed (dialog, tooltip), build it with native `<dialog>` / Radix primitives, or use a small headless library. For this build, native `<dialog>` and custom popovers are enough.

## 12. Charts

Do not add Recharts, D3, or Chart.js. The elevation profile is a small SVG component:

- width: 100% of the panel;
- height: 160–200 px;
- x scale: distance 0 → 23.3 km;
- y scale: elevation −2590 → −2340 m;
- path from `route_profile.json`;
- target markers at the nearest profile point;
- hover/focus tooltip;
- `aria-label` with the summary.

## 13. Testing

### Vitest config

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true
  }
});
```

### Setup

```ts
import "@testing-library/jest-dom";
```

### Playwright

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  use: { baseURL: "http://localhost:5173" },
  webServer: {
    command: "pnpm dev",
    url: "http://localhost:5173",
    reuseExistingServer: true
  }
});
```

## 14. Data pipeline (optional, for upgrades)

The app does not need Python at runtime. The provided `app_data` is already generated. For a sharper basemap or a slope layer, use GDAL:

### Crop the full HiRISE GeoTIFF

```bash
gdal_translate \
  -projwin 77.22 18.55 77.48 18.405 \
  -outsize 4096 0 \
  -of COG \
  JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first.tif \
  basemap_jezero_4096.tif
```

Then convert to WebP/PNG for the web:

```bash
gdal_translate -of WEBP -co QUALITY=85 basemap_jezero_4096.tif basemap_jezero_4096.webp
```

Update `manifest.json`:
- `basemap.image`
- `basemap.bounds`
- `basemap.resolution_m`
- `basemap.alignment: "verified"` only after checking against known target positions.

### Slope raster

```bash
gdaldem slope -alg ZevenbergenThorne -compute_edges jezero_dtm.tif slope.tif
gdaldem color-relief slope.tif slope_colors.txt slope_color.tif
```

Then export a small WebP and add a `slope` layer with a legend. Do not add a slope layer without the actual raster.

### Data validation script

`scripts/validate-data.mjs` should:
- read every JSON file in `public/data/`;
- check required keys;
- check that every `source_ids` entry exists in `sources.json`;
- check that every `target_id` in `evidence.json` exists in `targets.geojson`;
- check that route summary numbers match `route.geojson` properties;
- exit non-zero on failure.

Run it in CI and before the demo.

## 15. Deployment

### Vercel

- Framework preset: Vite.
- Build command: `pnpm build`.
- Output directory: `dist`.
- No environment variables.

### Netlify

- Build command: `pnpm build`.
- Publish directory: `dist`.

### GitHub Pages

- Set `base: "/<repo-name>/"` in `vite.config.ts`.
- Build and deploy `dist/` with an action.
- Ensure `public/data` paths are relative or use the base path.

## 16. Browser and performance notes

- MapLibre is the largest dependency; do not add another map or 3D library.
- Preload the basemap image with `<link rel="preload" as="image">` if it is above the fold.
- Keep the GeoJSON under ~250 KB; the provided files are already small.
- Do not render 500+ DOM markers; 9 targets use map layers, not DOM nodes.
- Use `requestAnimationFrame` for profile hover; do not re-render the whole app on mouse move.
- Test on a 1280×800 laptop with the browser devtools CPU throttle at 4×.

## 17. Dependency rationale

| Dependency | Why it is worth the weight |
|---|---|
| `maplibre-gl` | The core map; unavoidable |
| `zustand` | Tiny; avoids prop drilling |
| `zod` | Catches malformed data before it becomes a misleading map |
| `lucide-react` | Small icons; tree-shakeable |
| `clsx` + `tailwind-merge` | Clean conditional classes |
| `vitest` + Testing Library | Fast unit/component tests |
| `playwright` | One smoke test that proves the demo path |

If a dependency is not used, remove it. Do not ship unused packages.

## 18. Commands cheat sheet

```bash
pnpm dev                 # local development
pnpm build               # production build
pnpm preview             # serve the production build
pnpm test                # unit/component tests
pnpm test:e2e            # Playwright smoke test
pnpm lint                # lint (if configured)
pnpm data:check          # validate JSON data
```

## 19. Definition of tech-stack done

- [ ] `pnpm install --frozen-lockfile` succeeds.
- [ ] `pnpm dev` runs at `http://localhost:5173`.
- [ ] `pnpm build` succeeds with no TypeScript errors.
- [ ] `pnpm preview` serves the app from `dist/`.
- [ ] `pnpm test` passes.
- [ ] `pnpm test:e2e` passes.
- [ ] No unused dependencies.
- [ ] No API keys or secrets.
- [ ] The app works with the network disabled after the initial load.
