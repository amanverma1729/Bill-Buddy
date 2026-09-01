/**
 * Bill-Buddy Central API Configuration
 */

// Base URL configured for production Render backend (https://backend-x6e6.onrender.com) or local dev
const rawUrl = (import.meta.env.VITE_API_BASE_URL || "https://backend-x6e6.onrender.com").trim();

// Strip any trailing slashes to guarantee clean URL concatenation
export const API_BASE_URL = rawUrl.replace(/\/+$/, "");

/**
 * Safely constructs a full API URL given an endpoint path.
 * Handles missing or duplicate slashes gracefully.
 *
 * @param {string} endpoint - API path, e.g. "/user/saveUser" or "user/saveUser"
 * @returns {string} Fully qualified URL, e.g. "https://backend-x6e6.onrender.com/user/saveUser"
 */
export const getApiUrl = (endpoint = "") => {
  const cleanEndpoint = endpoint.trim().startsWith("/") ? endpoint.trim() : `/${endpoint.trim()}`;
  return `${API_BASE_URL}${cleanEndpoint}`;
};

export default API_BASE_URL;
