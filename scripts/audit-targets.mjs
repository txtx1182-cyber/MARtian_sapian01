import fs from "fs";
import path from "path";

const MARS_R_M = 3396190;
const rad = (d) => (d * Math.PI) / 180;

function haversineDistKm(coordA, coordB) {
  const [lon1, lat1] = coordA;
  const [lon2, lat2] = coordB;
  const dLat = rad(lat2 - lat1);
  const dLon = rad(lon2 - lon1);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLon / 2) ** 2;
  return (2 * MARS_R_M * Math.asin(Math.sqrt(h))) / 1000;
}

const targetsPath = path.resolve("public/data/targets.geojson");
const traversePath = path.resolve("public/data/traverse.geojson");

const targetsData = JSON.parse(fs.readFileSync(targetsPath, "utf-8"));
const traverseData = JSON.parse(fs.readFileSync(traversePath, "utf-8"));

const traverseCoords = traverseData.features[0].geometry.coordinates; // [lon, lat, elev][]

// Cumulative distance array along traverse
const cumulativeTraverseKm = [0];
for (let i = 1; i < traverseCoords.length; i++) {
  const stepKm = haversineDistKm(traverseCoords[i - 1], traverseCoords[i]);
  cumulativeTraverseKm.push(cumulativeTraverseKm[i - 1] + stepKm);
}

const totalTraverseKm = cumulativeTraverseKm[cumulativeTraverseKm.length - 1];

const t1Target = targetsData.features.find((f) => f.properties.id === "T1");
const t1Coord = t1Target.geometry.coordinates;

console.log("=== TARGET AUDIT RESULTS ===");
console.log(`Total traverse length: ${totalTraverseKm.toFixed(2)} km, ${traverseCoords.length} vertices\n`);

const results = [];

for (const f of targetsData.features) {
  const p = f.properties;
  const coord = f.geometry.coordinates;

  const straightLineFromT1Km = haversineDistKm(t1Coord, coord);

  // Find nearest vertex on traverse
  let minDistanceToTraverse = Infinity;
  let nearestVertexIndex = 0;

  for (let i = 0; i < traverseCoords.length; i++) {
    const d = haversineDistKm(coord, traverseCoords[i]);
    if (d < minDistanceToTraverse) {
      minDistanceToTraverse = d;
      nearestVertexIndex = i;
    }
  }

  const alongTraverseKm = cumulativeTraverseKm[nearestVertexIndex];

  results.push({
    id: p.id,
    name: p.name,
    storedDist: p.distance_from_landing_km,
    storedSol: p.nearest_rover_sol,
    straightLineFromT1Km: straightLineFromT1Km.toFixed(2),
    alongTraverseKm: alongTraverseKm.toFixed(2),
    minDistanceToTrackKm: minDistanceToTraverse.toFixed(2),
    nearestVertexIndex
  });
}

console.table(results);
