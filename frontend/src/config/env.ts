const rawApiUrl = import.meta.env.VITE_API_URL;
const rawTimeout = import.meta.env.VITE_API_TIMEOUT;

// --- API URL ---
if (!rawApiUrl || rawApiUrl.trim() === "") {
  throw new Error("VITE_API_URL is missing or empty");
}

const API_URL = rawApiUrl.trim();

// optional basic validation
if (!API_URL.startsWith("http")) {
  throw new Error("VITE_API_URL must be a valid URL (should start with http/https)");
}

// --- TIMEOUT ---
if (!rawTimeout || rawTimeout.trim() === "") {
  throw new Error("VITE_API_TIMEOUT is missing or empty");
}

const API_TIMEOUT = Number(rawTimeout);

if (Number.isNaN(API_TIMEOUT) || API_TIMEOUT <= 0) {
  throw new Error("VITE_API_TIMEOUT must be a positive number");
}

export const env = {
  API_URL,
  API_TIMEOUT,
} as const;
