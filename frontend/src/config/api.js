const rawUrl = (import.meta.env.VITE_API_BASE_URL || "https://bill-buddy1.onrender.com").trim();
export const API_BASE_URL = rawUrl.replace(/\/+$/, "");

export default API_BASE_URL;
