export const MARS_R_M = 3396190; // Mars 2000 sphere radius, metres
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

/**
 * Ground metres per CSS pixel at a given MapLibre zoom and latitude (512 px tiles).
 */
export function metersPerPixel(zoom: number, latDeg: number): number {
  const degPerPx = 360 / (512 * Math.pow(2, zoom));
  return degPerPx * (Math.PI / 180) * MARS_R_M * Math.cos((latDeg * Math.PI) / 180);
}

/**
 * Point at a bearing and distance from [lon, lat], on the Mars 2000 sphere.
 */
export function destination(
  lon: number,
  lat: number,
  bearingDeg: number,
  distM: number
): [number, number] {
  const d = distM / MARS_R_M;
  const b = rad(bearingDeg);
  const p1 = rad(lat);
  const l1 = rad(lon);
  const p2 = Math.asin(
    Math.sin(p1) * Math.cos(d) + Math.cos(p1) * Math.sin(d) * Math.cos(b)
  );
  const l2 =
    l1 +
    Math.atan2(
      Math.sin(b) * Math.sin(d) * Math.cos(p1),
      Math.cos(d) - Math.sin(p1) * Math.sin(p2)
    );
  return [deg(l2), deg(p2)];
}

/**
 * Great-circle distance in metres (haversine on Mars sphere).
 */
export function distanceM(a: [number, number], b: [number, number]): number {
  const dLat = rad(b[1] - a[1]);
  const dLon = rad(b[0] - a[0]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLon / 2) ** 2;
  return 2 * MARS_R_M * Math.asin(Math.sqrt(h));
}

/**
 * Out-and-back walk-back radius: speed x (EVA hours - on-site hours - stop hours) / 2.
 * Stop time defaults to 10 min per stop, as stated in ENV-MOB.
 */
export const walkBackRadiusKm = (
  speedKmh: number,
  evaH: number,
  siteH: number,
  stops = 0,
  stopMin = 10
): number =>
  (speedKmh * Math.max(evaH - siteH - (stops * stopMin) / 60, 0)) / 2;

/**
 * Generate 64-point circle polygon GeoJSON coordinates around anchor.
 */
export function createEvaCircleCoordinates(
  centerLon: number,
  centerLat: number,
  radiusKm: number,
  points = 64
): [number, number][] {
  const radiusM = radiusKm * 1000;
  const coords: [number, number][] = [];
  for (let i = 0; i <= points; i++) {
    const bearing = (i * 360) / points;
    coords.push(destination(centerLon, centerLat, bearing, radiusM));
  }
  return coords;
}
