# 04 — Visual Design and UI/UX

## 1. Design intent

The interface should feel like a **science instrument**, not a science-fiction dashboard. It should be dark, quiet, and precise, with the map as the primary surface and the evidence as the primary content. Avoid the cliché “red Mars” palette; use graphite, warm amber, and cool cyan. The visual hierarchy should make the four assessments legible before the user reads a paragraph.

**Three design principles**

1. **Evidence before decoration.** Every visual element must help the user see a claim, a source, a confidence level, or a terrain constraint.
2. **Uncertainty is visible.** Confidence badges, approximate-alignment warnings, and counter-evidence are first-class UI, not footnotes.
3. **The map is an index, not the argument.** The detail panel carries the scientific reasoning; the map shows where it applies.

## 2. Layout

### 2.1 Desktop (≥ 1200 px)

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR  JEI · Jezero Expedition Intelligence   [Objective ▾]  [Route] [Env] │
├───────────────┬──────────────────────────────────────────────┬───────────────┤
│ LEFT RAIL     │ MAP                                           │ RIGHT PANEL   │
│ 300 px        │ flexible                                     │ 380 px        │
│               │                                               │               │
│ Search        │  basemap                                      │  T7           │
│ Sorted by …   │  traverse                                     │  Bright Angel │
│               │  route (route mode)                           │               │
│ T1 Landing    │  targets                                      │  [Habitability]│
│ T2 Séítah     │                                               │  [Biosignature]│
│ T3 Máaz       │                                               │  [Science]    │
│ …             │                                               │  [Access]     │
│               │                                               │               │
│ Legend        │                                               │  Why / Access │
│               │                                               │  / Sources    │
├───────────────┴──────────────────────────────────────────────┴───────────────┤
│ STATUS  Mars 2000 planetocentric · HiRISE browse (approximate) · 20 m/px     │
└──────────────────────────────────────────────────────────────────────────────┘
```

- Top bar: 56 px.
- Status bar: 32 px.
- Left rail: 300 px, scrollable.
- Right panel: 380 px, scrollable.
- Map: fills the remaining space.
- The route profile appears as a 180 px bottom panel above the status bar when route mode is on.

### 2.2 Tablet (800–1199 px)

- Left rail collapses into a slide-over drawer opened by a “Targets” button.
- Right panel becomes a 360 px overlay on the right, dismissible.
- Map remains full width.

### 2.3 Mobile (< 800 px)

- Top bar compresses to brand + objective + menu.
- Map fills the viewport under the top bar.
- A bottom sheet has three snap points: collapsed (peek), half, full.
- The target list and target detail are tabs inside the bottom sheet.
- Route profile is a collapsible card inside the bottom sheet.

## 3. Design tokens

Use CSS variables in `src/styles/tokens.css` and Tailwind theme extensions.

### 3.1 Color

| Token | Value | Use |
|---|---|---|
| `--bg` | `#0B0F14` | App background |
| `--surface` | `#111821` | Panels, cards |
| `--surface-2` | `#16212C` | Hover, raised cards |
| `--border` | `#24303D` | Dividers, card borders |
| `--text` | `#E8EEF5` | Primary text |
| `--text-muted` | `#93A4B8` | Secondary text |
| `--text-dim` | `#6B7C90` | Metadata, captions |
| `--accent` | `#F2A33A` | Science/route, primary action |
| `--accent-soft` | `#3A2A16` | Amber tint background |
| `--cyan` | `#5CC8D7` | Observation, water, traverse |
| `--cyan-soft` | `#123039` | Cyan tint background |
| `--violet` | `#A78BFA` | Hypothesis |
| `--red` | `#E05D5D` | Warning, counter-evidence, hazard |
| `--red-soft` | `#3A1A1A` | Red tint background |
| `--green` | `#6FCF97` | Verified data, success |
| `--green-soft` | `#143024` | Green tint background |

Do not use pure black or pure white. Do not use red as the dominant brand color.

### 3.2 Typography

| Role | Font | Size | Weight | Line height |
|---|---|---|---:|---:|
| Display | Space Grotesk | 28–32 px | 600 | 1.1 |
| H1 | Space Grotesk | 22 px | 600 | 1.2 |
| H2 | Space Grotesk | 16 px | 600 | 1.25 |
| Body | IBM Plex Sans | 14 px | 400 | 1.5 |
| Body small | IBM Plex Sans | 12.5 px | 400 | 1.45 |
| Metadata | IBM Plex Mono | 11.5 px | 400 | 1.4 |
| Code / coordinates | IBM Plex Mono | 12 px | 400 | 1.4 |

Fallback stack: `"Space Grotesk", "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif`. For mono: `"IBM Plex Mono", ui-monospace, SFMono-Regular, monospace`.

Do not load more than two font families. If the network is unavailable, the system fallback must remain readable.

### 3.3 Spacing and radius

- Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48 px.
- Card radius: 10 px.
- Button radius: 8 px.
- Chip radius: 999 px.
- Map marker radius: 9 px (selected 12 px).
- Panel shadow: `0 8px 30px rgba(0,0,0,0.35)`.

### 3.4 Motion

- Default transition: 160 ms ease-out.
- Panel slide: 220 ms ease-out.
- Map flyTo: ≤ 600 ms.
- Respect `prefers-reduced-motion: reduce`; disable non-essential transitions and map fly animations.

## 4. Component specifications

### 4.1 Top bar

Left: a small square glyph (a topographic contour or a target reticle) + “JEI” + “Jezero Expedition Intelligence.”

Center-left: objective selector as a segmented control:

```
[ Geological ] [ Habitability ] [ Biosignature ] [ Accessibility ]
```

Right: `Route` toggle, `Environment` button, `About` button.

Rules:
- The objective selector is a radio group, not a dropdown, on desktop.
- On mobile it becomes a dropdown.
- The active objective has an amber underline and `aria-checked="true"`.
- The route toggle is a switch with a label, not an icon-only button.
- The Environment and About buttons have text labels on desktop and icons + tooltips on mobile.

### 4.2 Left rail

Header: “Targets” + count `9`.
Subheader: `Sorted by geological significance · qualitative`.
Search input: placeholder “Search targets, units, evidence…”.
Target list: one row per target.

Target row:

```
┌────────────────────────────────────────────┐
│ T7  Bright Angel / Cheyava Falls      ●    │
│     Bright Angel formation                 │
│     [Potential] [High] [Moderate]          │
└────────────────────────────────────────────┘
```

- `●` is the confidence dot: filled = high/moderate, half = low, hollow = unknown.
- The selected row has an amber left border and a slightly lighter background.
- The hovered row has a subtle surface-2 background.
- The row is a `<button>` or a list item with a button; keyboard focus is visible.
- The row shows at most three chips: the objective’s primary assessment plus science and access. The full four are in the detail panel.

Footer: legend:
- Evidence classes: Observation (cyan), Interpretation (amber), Hypothesis (violet), Counter-evidence (red).
- “No confirmed life” microcopy.

### 4.3 Map

- Background: `#0B0F14`.
- Basemap: grayscale image at 90% opacity, with a subtle dark overlay to make overlays legible.
- Traverse: dashed `#5CC8D7` at 1.5 px, opacity 0.55.
- Route: solid `#F2A33A` at 3 px, opacity 0.95, with a dark casing at 5 px.
- Targets: circle radius 9, fill `#0B0F14`, stroke 2.5 px in the objective color; code label in `IBM Plex Mono` 11 px, white, with a dark halo.
- Selected target: outer ring radius 16, 2 px amber; inner circle filled amber; label bold.
- Hovered target: ring radius 13, 1.5 px cyan.
- Target labels: show codes at the initial fit; hide only below zoom 9.5; full names in tooltip and panel.
- Map controls: zoom in/out and reset north, bottom-right, 32 px buttons, dark surface.

**Objective colors:**

| Objective | Ring color |
|---|---|
| Geological | `#F2A33A` |
| Habitability | `#5CC8D7` |
| Biosignature | `#A78BFA` |
| Accessibility | `#6FCF97` |

Do not change the target fill or the evidence class colors when the objective changes.

### 4.4 Target detail panel

Header:

```
T7  Bright Angel / Cheyava Falls
Bright Angel formation · 18.4974°N, 77.3051°E · −2354.5 m
[Potential biosignature — not confirmed evidence of life]
```

Then a confidence row:

```
Confidence: Moderate–Low
Why? Strong rover observations; the biological interpretation is unresolved and sample return is required.
```

Use the target’s `confidence_reason` field; do not invent a generic reason.

Then four assessment cards in a 2×2 grid:

```
┌─────────────────────┬─────────────────────┐
│ HABITABILITY        │ BIOSIGNATURE         │
│ High (interpreted)  │ Potential            │
│ Past environment    │ Not confirmed        │
├─────────────────────┼─────────────────────┤
│ SCIENTIFIC VALUE    │ ACCESSIBILITY        │
│ High                │ Moderate             │
│ Geology + organics  │ ~23 km along route   │
└─────────────────────┴─────────────────────┘
```

Rules:
- The four cards are equal visual weight. Do not make biosignature larger or red.
- The biosignature card always includes “Not confirmed” under the level.
- The accessibility card does not imply safety. It says “Moderate” and a distance; the route caveat is in the route panel.
- Each card has an info icon with a tooltip defining the dimension.

Tabs: `Why this target` | `Access` | `Sources`.

**Why this target** tab:
- a 2–3 sentence summary;
- an evidence list;
- each evidence card shows class, claim, instrument, confidence, source;
- counter-evidence is a separate block with a red left border and the label “Counter-evidence”;
- “What would change this assessment?” is a small block at the end of each evidence card or at the end of the list.

**Access** tab:
- distance from landing;
- nearest rover sol;
- route segment name;
- max grade and elevation range (if on route);
- a `Show on route` button;
- caveats: “Rover traverse segment, not a human-rated route”; “Elevation from rover localization, not a DTM”; “No boulder, dust, or communications model.”

**Sources** tab:
- source cards with citation, type badge, and external link;
- a “Copy citation” button.

### 4.5 Evidence card

```
┌─────────────────────────────────────────────────────────────┐
│ [OBSERVATION]  PIXL · SHERLOC · Mastcam-Z        Moderate   │
│ Organic-carbon-bearing mudstones contain sub-millimetre     │
│ Fe-phosphate nodules and millimetre-scale reaction fronts…  │
│                                                             │
│ Source: Hurowitz et al. (2025) →                            │
│                                                             │
│ Counter-evidence                                            │
│ Abiotic redox pathways can produce similar textures; the    │
│ organic carbon source is unresolved.                         │
│                                                             │
│ What would change this?                                     │
│ Isotopic, chiral, and high-sensitivity mineralogical        │
│ analysis of the returned sample.                            │
└─────────────────────────────────────────────────────────────┘
```

- Class badge colors: observation cyan, interpretation amber, hypothesis violet, public interpretation grey, counter-evidence red.
- The claim is the largest text in the card (14 px, medium).
- The counter-evidence block has a 3 px red left border and `--red-soft` background.
- The source link is a real link with the citation label, not “source 1.”

### 4.6 Assessment chip

```
[ BIOSIGNATURE · Potential ]
```

- Uppercase label, 10.5 px, letter-spacing 0.04em.
- Level in 12 px semibold.
- Background is the dimension tint; border is the dimension color at 30% opacity.
- Tooltip on hover/focus: one sentence explaining the dimension.
- Do not use a numeric score.

### 4.7 Route panel

```
Science traverse R1
Landing → Séítah → Delta front → Neretva → Bright Angel

23.3 km    +452 m    −237 m    max grade 29.9%

[Elevation profile]

Assumptions
• Rover traverse geometry, not a human route
• Elevations from rover localization, not a HiRISE DTM
• No slope-dependent speed model
• No obstacle, boulder, dust, or communications model

Rover traverse segment. Not a human-rated route.
```

- The route summary is a 2×2 grid of stat cards.
- The elevation profile is an SVG line chart with a subtle grid, 120 points, and target markers.
- The profile must have a text alternative: “Distance 23.3 km, elevation from −2585.9 m to −2349.3 m, cumulative ascent 452.3 m.”
- The warning is an amber-bordered callout, not a red alarm.

### 4.8 Environment drawer

A right-side drawer with five cards:

```
Radiation        [ANALOGUE]   No local RAD measurement
Atmosphere       [MEASURED]   MEDA environmental time series
Terrain          [MEASURED]   HiRISE DTM + rover grades
Water ice        [UNKNOWN]    No proven shallow ice at Jezero
Mobility         [ASSUMPTION] Design assumptions only
```

Each card:
- domain label;
- kind badge;
- headline;
- 2–3 sentence detail;
- source link(s);
- a “What this means” line.

The radiation card is amber-bordered. The water-ice card is neutral with a dashed border. The mobility card is explicitly “assumption.”

### 4.9 About drawer

Sections:
1. What this is.
2. What this is not.
3. How the four assessments work.
4. Why there is no single score.
5. Coordinates and basemap caveats.
6. Data sources.
7. The no-life statement.
8. Credits and license.

Use a readable max-width of 680 px and generous spacing.

### 4.10 Status bar

Left: `Mars 2000 planetocentric · equirectangular · positive east`
Center: `Basemap: USGS HiRISE browse · approximate alignment`
Right: `Planning aid, not a safety certification` + `Data & methods` link.

The status bar is always visible on desktop. On mobile, stack the items into two lines; do not hide the CRS or the basemap caveat.

## 5. States

### Loading

- Skeleton top bar and left rail.
- Map area shows a dark grid and “Loading Jezero data…”.
- No spinner over the whole screen; the shell remains visible.

### Error

- A centered card on a dark surface:
  - “Data could not be loaded”
  - file name
  - “Retry” button
  - “Open README” link
- The top bar remains visible.

### Empty selection

- Right panel:
  - “Select a target”
  - a short explanation of the four assessments
  - a “Start with T7” button and a “Start with T2” button.

### Empty evidence

- “No evidence records loaded for this target.”
- explain that the target summary is still available.
- no fake records.

### Route off

- Route panel hidden; route line hidden.
- A small “Show science traverse” button in the left rail footer.

## 6. Responsive rules

| Breakpoint | Behavior |
|---|---|
| ≥ 1440 px | 300 px rail, 380 px panel, generous map |
| 1200–1439 px | 280 px rail, 360 px panel |
| 1024–1199 px | rail becomes drawer; panel 360 px overlay |
| 768–1023 px | panel becomes bottom sheet at 45% height |
| < 768 px | map + bottom sheet; top bar compresses; status bar stacks to two lines (CRS + basemap caveat) |

Do not hide the four assessments on mobile. Stack them 2×2 or 1×4; never drop one.

## 7. Accessibility

- Contrast: body text `#E8EEF5` on `#0B0F14` is ~16:1; muted `#93A4B8` is ~7:1; amber `#F2A33A` on `#0B0F14` is ~8:1.
- Focus ring: 2 px `#F2A33A` with a 2 px offset; never remove outline without replacement.
- Target list: `role="list"` with buttons; `aria-current="true"` on selected.
- Map: `aria-label="Jezero Crater science map. Use the target list for accessible navigation."`
- Map markers: DOM markers are not required; if canvas markers are used, the list is the accessible equivalent.
- Evidence class: text label, not color alone.
- Icons: `aria-hidden="true"` if decorative; `aria-label` if interactive.
- Reduced motion: disable flyTo and panel transitions.
- Zoom: support 200% browser zoom without horizontal scrolling on desktop.

## 8. Copy deck

Use these strings exactly. Do not paraphrase the scientific caveats.

### Global

- `Jezero Expedition Intelligence`
- `A science evidence atlas and traverse planner for Jezero Crater.`
- `Planning aid, not a safety certification.`
- `No confirmed evidence of Martian life.`

### Status

- `Mars 2000 planetocentric · equirectangular · positive east`
- `Basemap: USGS HiRISE browse · approximate alignment`
- `Basemap is a 1024 px browse image; use the full-resolution USGS GeoTIFF for measurement.`

### Objective labels

- `Geological history`
- `Habitability`
- `Biosignature`
- `Accessibility`

### Assessment definitions

- `Habitability potential — could the past environment have supported life?`
- `Biosignature evidence — are observations consistent with biology, and how well are alternative explanations understood?`
- `Scientific value — could the target improve understanding of geological history, mineral formation, or environmental evolution?`
- `Accessibility — how difficult is it to reach and work at the target?`

### T7

- `Potential biosignature — not confirmed evidence of life.`
- `The observations are compelling, but the biological interpretation is unresolved. Returned-sample analysis is required.`
- `Likely vivianite and greigite` (not “confirmed”).
- `Counter-evidence: luminescence signals initially reported as consistent with organics can be explained by inorganic Ce³⁺ in phosphate and silicate defects.`

### Route

- `Rover traverse segment. Not a human-rated route.`
- `Elevations from rover localization, not a HiRISE DTM.`
- `No slope-dependent speed model has been applied.`
- `No obstacle, boulder, dust, or communications model has been applied.`

### Radiation

- `No local RAD measurement at Jezero.`
- `MSL RAD measured Gale Crater. This is an analogue/model estimate, not a local measurement.`

### Water ice

- `Ancient water is documented. Present-day shallow ice at Jezero is not established.`

### About

- `The strongest scientific statement the data support is: Jezero was habitable, and Bright Angel preserves a potential biosignature that requires sample return to resolve. That is not the same as evidence of life.`

## 9. Visual anti-patterns

Do not:

- use a red Mars globe as the hero image;
- use a “life detected” green badge;
- use a single gauge or dial for “mission readiness”;
- use a starfield or spaceship UI;
- use a 3D globe;
- use auto-rotating carousels;
- use a “confidence” percentage that implies statistical probability;
- use a “safety score”;
- use color alone to distinguish evidence classes;
- hide counter-evidence in a tooltip.

## 10. Design acceptance checklist

- [ ] The four assessments are visible for every target.
- [ ] The biosignature card always says “not confirmed.”
- [ ] The map and list selection are synchronized.
- [ ] The basemap caveat is visible in the status bar.
- [ ] The route warning is visible in route mode.
- [ ] The radiation card says “No local RAD measurement.”
- [ ] The water-ice card says “not established.”
- [ ] The About panel contains the no-life statement.
- [ ] No text uses a prohibited phrase from `03_SYSTEM_AND_OPERATIONAL_RULES.md`.
- [ ] The app is usable at 390×844 and 1440×900.
- [ ] Keyboard focus is visible on every interactive element.
