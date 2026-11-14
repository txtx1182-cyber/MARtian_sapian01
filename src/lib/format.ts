export function formatCoordinate(lat: number, lon: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}`;
  const lonStr = `${Math.abs(lon).toFixed(4)}°${lon >= 0 ? "E" : "W"}`;
  return `${latStr}, ${lonStr}`;
}

export function formatElevation(elevationM: number): string {
  const sign = elevationM < 0 ? "−" : elevationM > 0 ? "+" : "";
  return `${sign}${Math.abs(elevationM).toFixed(1)} m`;
}

export function formatElevationDelta(deltaM: number): string {
  const sign = deltaM < 0 ? "−" : deltaM > 0 ? "+" : "";
  return `${sign}${Math.abs(Math.round(deltaM))} m`;
}

export function formatDistance(km: number): string {
  return `${km.toFixed(1)} km`;
}

export function formatGrade(pct: number): string {
  const sign = pct > 0 ? "+" : pct < 0 ? "−" : "";
  return `${sign}${Math.abs(pct).toFixed(1)}%`;
}
