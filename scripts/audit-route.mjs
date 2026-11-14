import fs from "fs";
import path from "path";

const profilePath = path.resolve("public/data/route_profile.json");
const data = JSON.parse(fs.readFileSync(profilePath, "utf-8"));

const { summary, profile } = data;

const elevations = profile.map((p) => p.elevation_m);
const distances = profile.map((p) => p.distance_km);

const firstElev = elevations[0];
const lastElev = elevations[elevations.length - 1];
const netRise = lastElev - firstElev;

function computeAscentDescent(arr) {
  let ascent = 0;
  let descent = 0;
  for (let i = 1; i < arr.length; i++) {
    const diff = arr[i] - arr[i - 1];
    if (diff > 0) ascent += diff;
    else descent += Math.abs(diff);
  }
  return { ascent, descent };
}

function movingAverage(arr, windowSize) {
  const result = [];
  const half = Math.floor(windowSize / 2);
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - half);
    const end = Math.min(arr.length, i + half + 1);
    const slice = arr.slice(start, end);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    result.push(avg);
  }
  return result;
}

function computeGrades(elevArr, distArr, step = 1) {
  let maxGrade = -Infinity;
  let minGrade = Infinity;
  for (let i = step; i < elevArr.length; i++) {
    const dElevM = elevArr[i] - elevArr[i - step];
    const dDistM = (distArr[i] - distArr[i - step]) * 1000;
    if (dDistM > 0) {
      const grade = (dElevM / dDistM) * 100;
      if (grade > maxGrade) maxGrade = grade;
      if (grade < minGrade) minGrade = grade;
    }
  }
  return { maxGrade, minGrade };
}

const rawCalc = computeAscentDescent(elevations);
const ma5 = movingAverage(elevations, 5);
const calcMA5 = computeAscentDescent(ma5);
const ma9 = movingAverage(elevations, 9);
const calcMA9 = computeAscentDescent(ma9);

const grades1 = computeGrades(elevations, distances, 1);
const grades3 = computeGrades(elevations, distances, 3);
const grades5 = computeGrades(elevations, distances, 5);

console.log("=== ROUTE R1 AUDIT ===");
console.log(`Net elevation change: ${netRise > 0 ? "+" : ""}${netRise.toFixed(1)} m (from ${firstElev.toFixed(1)} m to ${lastElev.toFixed(1)} m)`);
console.log("\nAscent / Descent comparison:");
console.table([
  {
    Method: "Provided summary",
    "Ascent (m)": summary.ascent_m.toFixed(1),
    "Descent (m)": summary.descent_m.toFixed(1)
  },
  {
    Method: "Raw 170-point profile",
    "Ascent (m)": rawCalc.ascent.toFixed(1),
    "Descent (m)": rawCalc.descent.toFixed(1)
  },
  {
    Method: "5-point moving average",
    "Ascent (m)": calcMA5.ascent.toFixed(1),
    "Descent (m)": calcMA5.descent.toFixed(1)
  },
  {
    Method: "9-point moving average",
    "Ascent (m)": calcMA9.ascent.toFixed(1),
    "Descent (m)": calcMA9.descent.toFixed(1)
  }
]);

console.log("\nGrades at different baselines:");
console.table([
  { Baseline: "Stored summary (finer raw steps)", "Max Grade %": summary.max_grade_pct, "Min Grade %": summary.min_grade_pct },
  { Baseline: "1-point (~100 m step)", "Max Grade %": grades1.maxGrade.toFixed(1), "Min Grade %": grades1.minGrade.toFixed(1) },
  { Baseline: "3-point (~300 m step)", "Max Grade %": grades3.maxGrade.toFixed(1), "Min Grade %": grades3.minGrade.toFixed(1) },
  { Baseline: "5-point (~500 m step)", "Max Grade %": grades5.maxGrade.toFixed(1), "Min Grade %": grades5.minGrade.toFixed(1) }
]);

const diffPercent = Math.abs(calcMA5.ascent - summary.ascent_m) / summary.ascent_m;
if (diffPercent > 0.2) {
  console.log(`\n[FLAG TO HUMAN]: Smoothed gross ascent (${calcMA5.ascent.toFixed(1)} m) differs from provided summary (${summary.ascent_m.toFixed(1)} m) by ${(diffPercent * 100).toFixed(1)}% (greater than 20%).`);
}
