import type { TargetFeature, EvidenceRecord } from "./schemas";
import type { ObjectiveId } from "./constants";

export function parseQualitativeScore(str: string | undefined): number {
  if (!str) return 0;
  const lower = str.toLowerCase();

  // If compound string with en-dash, hyphen, or slash, take highest score
  const parts = str.split(/[–\-\/]/).map((p) => p.trim());
  if (parts.length > 1) {
    return Math.max(...parts.map(parseQualitativeScore));
  }

  if (lower.includes("high")) return 3;
  if (lower.includes("potential")) return 3;
  if (lower.includes("moderate")) return 2;
  if (lower.includes("weak")) return 1;
  if (lower.includes("low")) return 1;
  return 0;
}

export function parseAccessScore(str: string | undefined): number {
  if (!str) return 4;
  const lower = str.toLowerCase();
  if (lower.includes("easy")) return 1;
  if (lower.includes("moderate")) return 2;
  if (lower.includes("difficult")) return 3;
  return 4;
}

export function parseConfidenceScore(str: string | undefined): number {
  return parseQualitativeScore(str);
}

export function getBiosignatureEvidenceCount(
  targetId: string,
  evidenceRecords: EvidenceRecord[] = []
): number {
  return evidenceRecords.filter(
    (ev) =>
      ev.target_id === targetId &&
      (ev.supports?.includes("biosignature") ||
        ev.class === "counter-evidence" ||
        ev.claim.toLowerCase().includes("biosignature") ||
        ev.claim.toLowerCase().includes("organic"))
  ).length;
}

export function sortTargets(
  targets: TargetFeature[],
  objective: ObjectiveId,
  evidenceRecords: EvidenceRecord[] = []
): TargetFeature[] {
  const sorted = [...targets];

  switch (objective) {
    case "geological": {
      // science desc, confidence desc
      sorted.sort((a, b) => {
        const sciA = parseQualitativeScore(a.properties.science);
        const sciB = parseQualitativeScore(b.properties.science);
        if (sciB !== sciA) return sciB - sciA;

        const confA = parseConfidenceScore(a.properties.confidence);
        const confB = parseConfidenceScore(b.properties.confidence);
        return confB - confA;
      });
      break;
    }

    case "habitability": {
      // habitability desc, science desc
      sorted.sort((a, b) => {
        const habA = parseQualitativeScore(a.properties.habitability);
        const habB = parseQualitativeScore(b.properties.habitability);
        if (habB !== habA) return habB - habA;

        const sciA = parseQualitativeScore(a.properties.science);
        const sciB = parseQualitativeScore(b.properties.science);
        return sciB - sciA;
      });
      break;
    }

    case "biosignature": {
      // biosignature desc, then count of biosignature evidence records desc, then confidence desc
      sorted.sort((a, b) => {
        const bioA = parseQualitativeScore(a.properties.biosignature);
        const bioB = parseQualitativeScore(b.properties.biosignature);
        if (bioB !== bioA) return bioB - bioA;

        const countA = getBiosignatureEvidenceCount(a.properties.id, evidenceRecords);
        const countB = getBiosignatureEvidenceCount(b.properties.id, evidenceRecords);
        if (countB !== countA) return countB - countA;

        const confA = parseConfidenceScore(a.properties.confidence);
        const confB = parseConfidenceScore(b.properties.confidence);
        return confB - confA;
      });
      break;
    }

    case "accessibility": {
      // access asc (Easy first), distance asc
      sorted.sort((a, b) => {
        const accA = parseAccessScore(a.properties.access);
        const accB = parseAccessScore(b.properties.access);
        if (accA !== accB) return accA - accB;

        return a.properties.distance_from_landing_km - b.properties.distance_from_landing_km;
      });
      break;
    }
  }

  return sorted;
}

export function getObjectiveSortLabel(objective: ObjectiveId): string {
  switch (objective) {
    case "geological":
      return "Sorted by geological significance · qualitative, not a composite score";
    case "habitability":
      return "Sorted by habitability potential · qualitative, not a composite score";
    case "biosignature":
      return "Sorted by biosignature evidence · qualitative, not a composite score";
    case "accessibility":
      return "Sorted by terrain accessibility · qualitative, not a composite score";
  }
}
