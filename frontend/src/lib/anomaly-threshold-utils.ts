const MIN_THRESHOLD = 0.01;
const MAX_THRESHOLD = 1.0;

export function isValidThreshold(value: string): boolean {
  if (value.trim() === "") {
    return false;
  }
  const parsed = Number(value);
  return (
    Number.isFinite(parsed) && parsed >= MIN_THRESHOLD && parsed <= MAX_THRESHOLD
  );
}

export function buildAlertsQueryParams(
  threshold: number,
  startDate: string,
  endDate: string,
): URLSearchParams {
  const params = new URLSearchParams();
  params.set("threshold", String(threshold));
  if (startDate) {
    params.set("start_date", startDate);
  }
  if (endDate) {
    params.set("end_date", endDate);
  }
  return params;
}
