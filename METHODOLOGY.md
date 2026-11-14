# Jezero Expedition Intelligence (JEI) — Scientific & Operational Methodology

**NASA Space Apps Challenge 2026** — *Challenge 11: Interplanetary Survival Guide: Martian Map*

---

## 1. Why Evidence-First Ranking Replaces Composite Scores

### The Risk of the "Black-Box Habitability Score"
In exploratory planetary science, collapsing distinct qualitative and quantitative parameters into an arbitrary single score (e.g. *“Jezero Target Habitability: 8.4/10”*) creates an illusion of certainty that directly threatens mission success. A site may possess outstanding scientific value (e.g. ancient crustal megabreccia at the crater rim) while offering negligible biosignature preservation potential and presenting extreme terrain hazards.

### The JEI Quad-Assessment Framework
JEI evaluates every target across four independent dimensions:
1. **Habitability Potential:** Qualitative evaluation of past water activity, aqueous chemistry (pH, salinity), and energy sources.
2. **Biosignature Evidence:** Strength of observed physical/chemical markers (organic compounds, redox textures, morphological structures).
3. **Scientific Value:** Relevance to broader planetary science questions (crustal differentiation, atmospheric evolution, volcanic chronometry).
4. **Accessibility:** Terrain difficulty, slope steepness, obstacle density, and ingress distance from landing or landing infrastructure.

These four dimensions are displayed as equal-weight assessment cards. The default list is never ranked by an opaque weighted average.

---

## 2. Objective Sorting Algorithms

When an astronaut or scientist selects a specific operational objective in the TopBar, JEI sorts the target register using clear, deterministic qualitative criteria without modifying the underlying assessments.

### Sorting Priority Rules
1. **Geological History:**
   - Primary: `science` score descending (High → Moderate → Low)
   - Secondary: `confidence` level descending (High → Moderate → Low)
2. **Habitability Potential:**
   - Primary: `habitability` potential descending (High → Moderate → Low)
   - Secondary: `science` score descending
3. **Biosignature Evidence:**
   - Primary: `biosignature` score descending (`Potential` ranked highest, as defined by NASA astrobiology protocols)
   - Secondary: Number of supporting biosignature evidence records descending
   - Tertiary: `confidence` level descending
4. **Accessibility:**
   - Primary: `access` rating ascending (`Easy` first, then `Moderate`, then `Difficult`)
   - Secondary: `distance_from_landing_km` ascending

### Ordinal Weight Mapping
For compound strings (e.g. *"Low to Moderate"* or *"Moderate (inferred)"*), the parser extracts the highest token to ensure fair relative sorting. Under the biosignature objective, `"Potential"` is assigned the highest ordinal weight, correctly elevating **T7 (Bright Angel / Cheyava Falls)** to the top of the list while maintaining the explicit label *"Potential biosignature — not confirmed evidence of life."*

---

## 3. Elevation Profile Derivation & Smoothing Analysis

### Terrain Elevation Source
Route R1 elevation points in `route_profile.json` were derived by sampling a 1 m/pixel Digital Terrain Model (DTM) produced by the USGS Astrogeology Science Center from stereo pairs acquired by the High Resolution Imaging Science Experiment (HiRISE) on NASA's Mars Reconnaissance Orbiter (MRO).

### The Micro-Topography vs. Human Traversal Paradox
Sampling fine-resolution DTMs along a rover path introduces high-frequency elevation noise caused by meter-scale dune ripples, boulder fields, and local rover switchbacks.  
As revealed by `scripts/audit-route.mjs`:
- **Raw HiRISE Step Sampling:** +452.3 m gross ascent / -236.8 m gross descent
- **True Net Terrain Rise:** **+215.4 m** (from -2569.9 m to -2354.5 m)
- **5-Point Moving Average (~500 m filter):** **+300.8 m** gross ascent / -88.8 m gross descent
- **Apparent Grade:** Max 29.9% on micro-steps; drops to 18.4% on 300 m baselines and 9.5% on 500 m baselines.

### Architectural Decision
Rather than altering the authoritative NASA-provided dataset, JEI displays the exact stored 452 m gross ascent to preserve data fidelity, while providing interactive tooltips and secondary labels that explain the difference between micro-topography climbing and human-scale smoothed grades.

---

## 4. EVA Sortie Operational Walk-Back Model Physics

The interactive EVA Sortie model simulates realistic extravehicular operational limits for surface crew planning sorties from a landing craft, habitat, or pressurized rover.

### Spherical Geodesy on Mars
Unlike generic Earth-based mapping tools that use WGS84 or spherical Earth radii ($R \approx 6,371\text{ km}$), JEI strictly implements IAU Mars 2000 planetocentric spherical geodesy:
$$\text{Radius of Mars } (R_{\text{Mars}}) = 3,396,190\text{ meters}$$

Great-circle distance between coordinates $(\phi_1, \lambda_1)$ and $(\phi_2, \lambda_2)$ in radians is calculated via the spherical law of cosines / Haversine formula:
$$\Delta\sigma = 2 \arcsin \left( \sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)} \right)$$
$$d = R_{\text{Mars}} \cdot \Delta\sigma$$

### Walk-Back Radius Formulation
In human planetary surface exploration, the maximum sortie radius is strictly bounded by the **emergency walk-back constraint**: the crew must have sufficient life-support consumables (oxygen, battery power, cooling water) to walk back to the pressurized habitat or rover on foot at a conservative walking pace, even if an unpressurized rover fails at the furthest point.

The operational sortie radius $R_{\text{walkback}}$ is calculated as:
$$T_{\text{avail}} = T_{\text{total}} \cdot (1 - \text{reserve\_pct}) - T_{\text{stationary}}$$
$$R_{\text{walkback}} = \frac{T_{\text{avail}} \cdot V_{\text{walk}} \cdot f_{\text{grade}}}{2}$$

Where:
- $T_{\text{total}}$: Total planned EVA duration (hours, range 2–8 h, nominal 4 h).
- $\text{reserve\_pct}$: Mandatory emergency life support reserve (10–35%, nominal 20%).
- $T_{\text{stationary}}$: Planned non-walking time at science targets (5–30 min allowance).
- $V_{\text{walk}}$: Nominal suited walking speed (0.8–2.5 km/h, nominal 1.5 km/h in 0.38g).
- $f_{\text{grade}}$: Conservative terrain slope correction factor ($0.85$–$0.95$, accounting for 10–25% grade metabolic cost based on Minetti biomechanical equations).
- Division by 2: Outbound and inbound traversal legs.

Under nominal baseline inputs (4.0 h EVA, 20% reserve = 3.2 h, 15 min sampling stop = 2.95 h available, 1.5 km/h, $0.90$ grade factor):
$$R_{\text{walkback}} \approx \frac{2.95 \times 1.5 \times 0.90}{2} \approx 1.99\text{ km}$$

Every target is dynamically tested against this boundary to indicate whether it lies within safe operational range of the designated anchor point.

---

## 5. Environmental Domain Scientific Caveats

### Radiation Analogue Disclosure
Perseverance does not carry a Radiation Assessment Detector (RAD). The surface radiation numbers reported in literature derive from the MSL Curiosity RAD instrument located at Gale Crater ($4.5^\circ\text{S}$).  
Because Jezero Crater is situated at $18.4^\circ\text{N}$, with different atmospheric column depth and seasonal pressure variations, JEI explicitly classifies radiation as **Analogue / Model** and displays:  
*“No local RAD measurement at Jezero. MSL RAD measured Gale Crater. This is an analogue/model estimate, not a local measurement.”*

### Water-Ice Subsurface Mapping Disclosure
NASA's Subsurface Water Ice Mapping (SWIM) project focuses on mid-to-high latitudes ($>30^\circ\text{N}$) where radar sounding (SHARAD) and neutron spectrometers indicate widespread shallow ice deposits. At Jezero's equatorial/subtropical latitude ($18.4^\circ\text{N}$), present-day shallow ice is unstable under current atmospheric conditions.  
JEI classifies water ice as **Unknown** and explicitly states:  
*“Ancient water is documented. Present-day shallow ice at Jezero is not established.”*
