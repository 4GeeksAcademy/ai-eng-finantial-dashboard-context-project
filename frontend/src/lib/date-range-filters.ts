import { type DateRangeFilters } from "./financial-types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidISODate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const [yearText, monthText, dayText] = value.split("-");
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);

  const parsed = new Date(Date.UTC(year, month - 1, day));
  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  );
}

export function normalizeDateInput(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  return isValidISODate(trimmed) ? trimmed : null;
}

export function validateDateRange(filters: DateRangeFilters): string | null {
  const { startDate, endDate } = filters;

  if (startDate && !isValidISODate(startDate)) {
    return "La fecha de inicio es invalida.";
  }

  if (endDate && !isValidISODate(endDate)) {
    return "La fecha de fin es invalida.";
  }

  if (startDate && endDate && startDate > endDate) {
    return "La fecha de inicio no puede ser mayor a la fecha de fin.";
  }

  return null;
}

export function buildMetricsQuery(filters: DateRangeFilters): string {
  const params = new URLSearchParams();

  if (filters.startDate) {
    params.set("start_date", filters.startDate);
  }

  if (filters.endDate) {
    params.set("end_date", filters.endDate);
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function buildPeriodLabel(filters: DateRangeFilters): string {
  const { startDate, endDate } = filters;

  if (startDate && endDate) {
    return `${startDate} - ${endDate}`;
  }

  if (startDate) {
    return `Desde ${startDate}`;
  }

  if (endDate) {
    return `Hasta ${endDate}`;
  }

  return "Full Year";
}
