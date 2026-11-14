import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TargetDetail } from "../components/targets/TargetDetail";
import { RoutePanel } from "../components/route/RoutePanel";
import { EnvironmentDrawer } from "../components/environment/EnvironmentDrawer";
import { AssessmentChips } from "../components/targets/AssessmentChips";
import { useAppStore } from "../store/useAppStore";
import type {
  TargetFeature,
  EvidenceRecord,
  Source,
  RouteGeoJSON,
  RouteProfile,
  EnvironmentData
} from "../lib/schemas";

const sampleSources: Source[] = [
  {
    id: "P4",
    citation: "Hurowitz et al. (2025), Nature 645, 332–340",
    url: "https://doi.org/10.1038/s41586-025-09413-0",
    type: "paper"
  },
  {
    id: "P9",
    citation: "Scheller et al. (2024), Science Advances 10, eadm8241",
    url: "https://doi.org/10.1126/sciadv.adm8241",
    type: "paper"
  },
  {
    id: "E1",
    citation: "Hassler et al. (2014), Science 343, 1244740",
    url: "https://doi.org/10.1126/science.1244740",
    type: "paper"
  }
];

const sampleTargetT7: TargetFeature = {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [77.3051, 18.4974, -2354.5]
  },
  properties: {
    id: "T7",
    code: "T7",
    name: "Bright Angel / Cheyava Falls",
    elevation_m: -2354.5,
    unit: "Bright Angel formation",
    context: "Mudstones and conglomerate outcrops along Neretva Vallis.",
    summary:
      "The strongest biosignature candidate in Jezero. Preserves organic carbon, reaction fronts, and iron-phosphate nodules. Requires sample return to resolve origin.",
    habitability: "High (interpreted)",
    biosignature: "Potential (highest documented, not confirmed)",
    science: "High",
    access: "Moderate",
    confidence: "Moderate–Low",
    confidence_reason:
      "Strong rover observations; the biological interpretation is unresolved and sample return is required.",
    source_ids: ["P4", "P9"],
    distance_from_landing_km: 23.3,
    nearest_rover_sol: 1189,
    coordinate_note: "Approximate; nearest rover daily position used as proxy."
  }
};

const sampleEvidenceT7: EvidenceRecord[] = [
  {
    id: "EV-T7-01",
    target_id: "T7",
    claim:
      "Organic-carbon-bearing mudstones contain sub-millimetre Fe-phosphate nodules and millimetre-scale reaction fronts.",
    class: "observation",
    instrument: "PIXL, SHERLOC",
    source_ids: ["P4"],
    confidence: "Moderate",
    supports: ["biosignature"],
    counter_evidence: "Abiotic redox pathways can produce similar textures.",
    what_would_change: "Returned sample analysis."
  },
  {
    id: "EV-T7-04",
    target_id: "T7",
    claim:
      "Luminescence signals initially reported as consistent with organics can be explained by inorganic Ce³⁺ in phosphate and silicate defects.",
    class: "counter-evidence",
    instrument: "SHERLOC",
    source_ids: ["P9"],
    confidence: "Moderate",
    supports: ["counter-evidence"],
    counter_evidence: "Inorganic luminescence is a viable competing explanation.",
    what_would_change: "Laboratory validation of Ce³⁺ luminescence mechanisms."
  }
];

const sampleRouteData: RouteGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [77.450886, 18.444627, -2569.9],
          [77.305135, 18.497449, -2354.5]
        ]
      },
      properties: {
        id: "R1",
        name: "Landing to Bright Angel",
        kind: "rover_traverse_segment",
        start_target: "T1",
        end_target: "T7",
        waypoints: ["T1", "T2", "T4", "T6", "T7"],
        distance_km: 23.3,
        ascent_m: 452.3,
        descent_m: 236.8,
        max_grade_pct: 29.9,
        min_grade_pct: -20.7,
        dem_source: "PDS rover localization",
        note: "Follows the rover daily track."
      }
    }
  ]
};

const sampleRouteProfile: RouteProfile = {
  route_id: "R1",
  summary: {
    distance_km: 23.3,
    ascent_m: 452.3,
    descent_m: 236.8,
    max_grade_pct: 29.9,
    min_grade_pct: -20.7,
    elevation_min_m: -2585.9,
    elevation_max_m: -2349.3
  },
  profile: [
    { distance_km: 0.0, elevation_m: -2569.9, lat: 18.444, lon: 77.45, sol: 0 },
    { distance_km: 23.3, elevation_m: -2354.5, lat: 18.497, lon: 77.305, sol: 1189 }
  ],
  assumptions: [
    "Rover traverse geometry, not a human route",
    "Elevations from rover localization, not a HiRISE DTM",
    "No slope-dependent speed model applied",
    "No obstacle, boulder, dust, or communications model applied"
  ]
};

const sampleEnvironment: EnvironmentData = {
  items: [
    {
      id: "ENV-RAD",
      domain: "Radiation",
      kind: "analogue",
      headline: "No local RAD measurement",
      detail:
        "There is no Radiation Assessment Detector at Jezero. MSL RAD measured the surface environment at Gale Crater.",
      source_ids: ["E1"],
      confidence: "Low",
      display: "Source: Gale RAD analogue / model. Not a local measurement."
    },
    {
      id: "ENV-ICE",
      domain: "Water ice",
      kind: "unknown",
      headline: "No proven shallow ice at Jezero",
      detail: "SWIM-style subsurface ice mapping focuses on mid-to-high latitudes.",
      source_ids: [],
      confidence: "Low",
      display: "Ancient water is documented; present-day shallow ice is not."
    }
  ]
};

describe("Component Verification: TargetDetail & AssessmentChips", () => {
  it("displays non-negotiable potential-biosignature copy on T7", () => {
    render(
      <TargetDetail
        target={sampleTargetT7}
        evidenceRecords={sampleEvidenceT7}
        allSources={sampleSources}
      />
    );

    expect(
      screen.getByText("Potential biosignature — not confirmed evidence of life.")
    ).toBeInTheDocument();
  });

  it("displays counter-evidence for T7 in the default evidence view", () => {
    render(
      <TargetDetail
        target={sampleTargetT7}
        evidenceRecords={sampleEvidenceT7}
        allSources={sampleSources}
      />
    );

    // Counter-evidence claim
    expect(
      screen.getByText(
        /Luminescence signals initially reported as consistent with organics can be explained by inorganic Ce³⁺/i
      )
    ).toBeInTheDocument();

    // Counter-evidence block label
    const counterLabels = screen.getAllByText(/Counter-evidence/i);
    expect(counterLabels.length).toBeGreaterThan(0);
  });

  it("renders the four separate assessment chips and never a composite score", () => {
    render(<AssessmentChips properties={sampleTargetT7.properties} />);

    expect(screen.getByText("HABITABILITY")).toBeInTheDocument();
    expect(screen.getByText("BIOSIGNATURE")).toBeInTheDocument();
    expect(screen.getByText("SCIENTIFIC VALUE")).toBeInTheDocument();
    expect(screen.getByText("ACCESSIBILITY")).toBeInTheDocument();

    // Biosignature chip must state "Not confirmed"
    expect(screen.getByText("Not confirmed")).toBeInTheDocument();
  });
});

describe("Component Verification: RoutePanel", () => {
  it("displays the exact route summary numbers and the non-rated caveat", () => {
    render(
      <RoutePanel
        routeData={sampleRouteData}
        routeProfile={sampleRouteProfile}
        targets={[sampleTargetT7]}
      />
    );

    // Exact summary numbers
    expect(screen.getByText("23.3 km")).toBeInTheDocument();
    expect(screen.getByText("+452 m")).toBeInTheDocument();
    expect(screen.getByText("+29.9%")).toBeInTheDocument();

    // Non-negotiable route caveat
    expect(
      screen.getByText("Rover traverse segment. Not a human-rated route.")
    ).toBeInTheDocument();
  });
});

describe("Component Verification: EnvironmentDrawer", () => {
  it("displays the exact radiation and water-ice non-negotiable caveats", () => {
    useAppStore.setState({ environmentOpen: true });

    render(
      <EnvironmentDrawer
        environmentData={sampleEnvironment}
        allSources={sampleSources}
      />
    );

    // Radiation caveat
    expect(
      screen.getByText(
        "No local RAD measurement at Jezero. MSL RAD measured Gale Crater. This is an analogue/model estimate, not a local measurement."
      )
    ).toBeInTheDocument();

    // Water ice caveat
    expect(
      screen.getByText(
        "Ancient water is documented. Present-day shallow ice at Jezero is not established."
      )
    ).toBeInTheDocument();
  });
});
