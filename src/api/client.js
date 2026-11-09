import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({ baseURL: BASE_URL });

const TOKEN_KEY = "ujuzi_access";
const REFRESH_KEY = "ujuzi_refresh";

export function getAccess() { return localStorage.getItem(TOKEN_KEY); }
export function getRefresh() { return localStorage.getItem(REFRESH_KEY); }
export function isAuthenticated() { return Boolean(getAccess()); }

export function storeTokens(access, refresh) {
  localStorage.setItem(TOKEN_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}
export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// --- Request interceptor ---------------------------------------------------
// Honors `config.skipAuth` so public calls (e.g. featured opportunities) can
// bypass the Bearer header entirely.
api.interceptors.request.use((config) => {
  if (config.skipAuth) return config;
  const token = getAccess();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor --------------------------------------------------
// Refreshes the access token once on a 401, but skips the refresh dance for
// requests that explicitly opted out of auth (`skipAuth`) or that have
// already been retried.
let refreshing = null;

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { response, config } = error;

    const canRetry =
      response &&
      response.status === 401 &&
      config &&
      !config._retried &&
      !config.skipAuth &&
      getRefresh();

    if (canRetry) {
      config._retried = true;
      try {
        refreshing =
          refreshing ||
          axios.post(`${BASE_URL}/auth/token/refresh/`, {
            refresh: getRefresh(),
          });
        const { data } = await refreshing;
        refreshing = null;
        storeTokens(data.access, undefined);
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${data.access}`;
        return api(config);
      } catch {
        refreshing = null;
        clearTokens();
        if (window.location.pathname.startsWith("/app")) {
          window.location.href = "/login?expired=1";
        }
      }
    }
    return Promise.reject(error);
  }
);

// --- Error helper ----------------------------------------------------------
export function errorMessage(
  err,
  fallback = "Something went wrong. Please try again."
) {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;
  if (typeof data === "string") return data;

  // DRF can return `detail` as a string OR a list of strings.
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail) && data.detail.length) {
    return String(data.detail[0]);
  }

  const errors = data.errors || data;
  if (errors && typeof errors === "object") {
    for (const key of Object.keys(errors)) {
      const val = errors[key];
      if (Array.isArray(val) && val.length) {
        return typeof val[0] === "string"
          ? `${key}: ${val[0]}`
          : fallback;
      }
      if (typeof val === "string") return `${key}: ${val}`;
    }
  }
  return fallback;
}

// --- Helpers ---------------------------------------------------------------
export function downloadFile(docId, filename = "document") {
  return api
    .get(`/files/${docId}/`, { responseType: "blob" })
    .then((res) => {
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
}

export function downloadReport(queryString, filename = "report") {
  return api
    .get(`/reports/export/?${queryString}`, { responseType: "blob" })
    .then((res) => {
      const ext = queryString.includes("format=xlsx") ? "xlsx" : "csv";
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
}