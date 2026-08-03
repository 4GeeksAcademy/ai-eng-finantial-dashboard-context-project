import type { FinancialMovement } from "../financial-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export async function fetchFinancialData(signal?: AbortSignal): Promise<FinancialMovement[]> {
  const response = await fetch(`${API_BASE_URL}/api/metrics`, { signal });
  if (!response.ok) {
    let detail = `Error HTTP ${response.status}: ${response.statusText}`;
    try {
      const errJson = await response.json();
      if (errJson.detail) detail = errJson.detail;
    } catch {
      // ignore json parse error
    }
    throw new Error(detail);
  }
  return response.json();
}
