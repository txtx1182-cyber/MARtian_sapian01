import { describe, it, expect } from "vitest";
import {
  parseQualitativeScore,
  parseAccessScore,
  parseConfidenceScore,
  sortTargets,
  getObjectiveSortLabel
} from "../lib/sort";
import {
  formatCoordinate,
  formatElevation,
  formatElevationDelta,
  formatDistance,
  formatGrade
} from "../lib/format";
import type { TargetFeature, EvidenceRecord } from "../lib/schemas";

describe("Formatting Utilities", () => {
  it("formats coordinates properly in planetocentric N/E", () => {
    expect(formatCoordinate(18.4974, 77.3051)).toBe("18.4974°N, 77.3051°E");
    expect(formatCoordinate(-18.4446, -77.4509)).toBe("18.4446°S, 77.4509°W");
  });

  it("formats elevation with correct sign", () => {
    expect(formatElevation(-2354.5)).toBe("−2354.5 m");
    expect(formatElevation(120.3)).toBe("+120.3 m");
    expect(formatElevation(0)).toBe("0.0 m");
  });

  it("formats elevation deltas", () => {
    expect(formatElevationDelta(452.3)).toBe("+452 m");
    expect(formatElevationDelta(-236.8)).toBe("−237 m");
  });

  it("formats distance and grade", () => {
    expect(formatDistance(23.3)).toBe("23.3 km");
    expect(formatGrade(29.9)).toBe("+29.9%");
    expect(formatGrade(-20.7)).toBe("−20.7%");
  });
});

describe("Compound String Assessment Parsing", () => {
  it("extracts maximum qualitative score for single and compound strings", () => {
    expect(parseQualitativeScore("High")).toBe(3);
    expect(parseQualitativeScore("Moderate")).toBe(2);
    expect(parseQualitativeScore("Low")).toBe(1);
    expect(parseQualitativeScore("Unknown")).toBe(0);

    // Compound strings
    expect(parseQualitativeScore("Low–Moderate")).toBe(2);
    expect(parseQualitativeScore("Moderate–Low")).toBe(2);
    expect(parseQualitativeScore("Moderate–High (hypothesis)")).toBe(3);
    expect(parseQualitativeScore("Potential (highest documented, not confirmed)")).toBe(3);
    expect(parseQualitativeScore("Weak / none documented")).toBe(1);
  });

  it("parses accessibility levels where Easy is lowest weight (highest priority)", () => {
    expect(parseAccessScore("Easy")).toBe(1);
    expect(parseAccessScore("Moderate")).toBe(2);
    expect(parseAccessScore("Difficult")).toBe(3);
    expect(parseAccessScore("Unknown")).toBe(4);
  });

  it("parses confidence score", () => {
    expect(parseConfidenceScore("High")).toBe(3);
    expect(parseConfidenceScore("Moderate–Low")).toBe(2);
    expect(parseConfidenceScore("Low")).toBe(1);
  });
});

describe("Objective Target Sorting", () => {
  const mockTargets: TargetFeature[] = [
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [77.45, 18.44, -2569.9] },
      properties: {
        id: "T1",
        code: "T1",
        name: "Landing",
        elevation_m: -2569.9,
        unit: "Floor",
        context: "Landing site",
        summary: "Landing",
        habitability: "Low–Moderate",
        biosignature: "None documented",
        science: "Moderate",
        access: "Easy",
        confidence: "High",
        confidence_reason: "Mission fact",
        source_ids: ["P1"],
        distance_from_landing_km: 0.0,
        nearest_rover_sol: 0,
        coordinate_note: "Control point"
      }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [77.44, 18.43, -2571.8] },
      properties: {
        id: "T2",
        code: "T2",
        name: "Séítah",
        elevation_m: -2571.8,
        unit: "Séítah",
        context: "Cumulate",
        summary: "Cumulate",
        habitability: "Moderate",
        biosignature: "Weak / none documented",
        science: "High",
        access: "Easy",
        confidence: "Moderate",
        confidence_reason: "Observations",
        source_ids: ["P2"],
        distance_from_landing_km: 2.1,
        nearest_rover_sol: 200,
        coordinate_note: "Approximate"
      }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [77.3, 18.49, -2354.5] },
      properties: {
        id: "T7",
        code: "T7",
        name: "Bright Angel",
        elevation_m: -2354.5,
        unit: "Bright Angel",
        context: "Cheyava Falls",
        summary: "Mudstone",
        habitability: "High (interpreted)",
        biosignature: "Potential (highest documented, not confirmed)",
        science: "High",
        access: "Moderate",
        confidence: "Moderate–Low",
        confidence_reason: "Sample return required",
        source_ids: ["P4"],
        distance_from_landing_km: 23.3,
        nearest_rover_sol: 1189,
        coordinate_note: "Approximate"
      }
    },
    {
      type: "Feature",
      geometry: { type: "Point", coordinates: [77.22, 18.42, -1973.6] },
      properties: {
        id: "T9",
        code: "T9",
        name: "Rim",
        elevation_m: -1973.6,
        unit: "Rim",
        context: "Rim",
        summary: "Rim",
        habitability: "Unknown",
        biosignature: "Unknown",
        science: "High",
        access: "Difficult",
        confidence: "Low",
        confidence_reason: "Orbital only",
        source_ids: ["P1"],
        distance_from_landing_km: 35.0,
        nearest_rover_sol: 0,
        coordinate_note: "Approximate"
      }
    }
  ];

  const mockEvidence: EvidenceRecord[] = [
    {
      id: "EV-T7-01",
      target_id: "T7",
      claim: "Organic-carbon-bearing mudstones with nodules",
      class: "observation",
      instrument: "PIXL",
      source_ids: ["P4"],
      confidence: "Moderate",
      supports: ["biosignature"],
      counter_evidence: "Abiotic redox possible",
      what_would_change: "Returned sample"
    }
  ];

  it("sorts by Biosignature: puts T7 first", () => {
    const sorted = sortTargets(mockTargets, "biosignature", mockEvidence);
    expect(sorted[0].properties.id).toBe("T7");
  });

  it("sorts by Accessibility: puts T1 first and T9 last", () => {
    const sorted = sortTargets(mockTargets, "accessibility", mockEvidence);
    expect(sorted[0].properties.id).toBe("T1");
    expect(sorted[sorted.length - 1].properties.id).toBe("T9");
  });

  it("sorts by Geological: evaluates science desc, confidence desc", () => {
    const sorted = sortTargets(mockTargets, "geological", mockEvidence);
    // T2 has Science: High, Confidence: Moderate (score 2)
    // T7 has Science: High, Confidence: Moderate-Low (score 2)
    // T9 has Science: High, Confidence: Low (score 1)
    // T1 has Science: Moderate (score 2)
    expect(sorted[sorted.length - 1].properties.id).toBe("T1");
  });

  it("sorts by Habitability: puts High habitability targets first", () => {
    const sorted = sortTargets(mockTargets, "habitability", mockEvidence);
    expect(sorted[0].properties.id).toBe("T7"); // High
  });

  it("returns appropriate qualitative sort labels", () => {
    expect(getObjectiveSortLabel("biosignature")).toContain("Sorted by biosignature evidence");
    expect(getObjectiveSortLabel("geological")).toContain("Sorted by geological significance");
    expect(getObjectiveSortLabel("accessibility")).toContain("Sorted by terrain accessibility");
    expect(getObjectiveSortLabel("habitability")).toContain("Sorted by habitability potential");
  });
});
