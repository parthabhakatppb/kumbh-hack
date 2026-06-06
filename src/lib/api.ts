const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchTelemetryVitals() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/vitals`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch telemetry vitals");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchTelemetryVitals):", error);
    throw error;
  }
}

export async function fetchSystemStatus() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/system-status`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch system status");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchSystemStatus):", error);
    throw error;
  }
}

export async function fetchHistory() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/history`, {
      cache: "no-store",
    });
    if (!response.ok) throw new Error("Failed to fetch history");
    return await response.json();
  } catch (error) {
    console.error("API Error (fetchHistory):", error);
    throw error;
  }
}

export async function triggerSimulatedIncident() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/trigger-incident`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to trigger emergency vector");
    return await response.json();
  } catch (error) {
    console.error("API Error (triggerSimulatedIncident):", error);
    throw error;
  }
}

export async function executeOmniStrategy(strategyId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/execute-strategy/${strategyId}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!response.ok) throw new Error("Failed to authorize strategy execution");
    return await response.json();
  } catch (error) {
    console.error("API Error (executeOmniStrategy):", error);
    throw error;
  }
}