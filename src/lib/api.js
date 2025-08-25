// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
  withCredentials: true,
});

const get = (k) => localStorage.getItem(k);
const set = (k, v) => localStorage.setItem(k, v);
const del = (k) => localStorage.removeItem(k);

function hardLogout() {
  del("accessToken"); del("refreshToken"); del("username");
  if (window.location.pathname !== "/login") window.location.assign("/login");
}

// --- Request: añade Authorization Bearer si hay token ---
api.interceptors.request.use((config) => {
  const token = get("accessToken");
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  if (!config.headers["Content-Type"]) config.headers["Content-Type"] = "application/json";
  return config;
});

// --- Refresh controlado para 402 ---
let refreshPromise = null;

async function refreshTokens() {
  const refreshToken = get("refreshToken");
  const username = get("username");
  if (!refreshToken || !username) throw new Error("missing refresh credentials");
  const { data } = await axios.get(`${process.env.REACT_APP_URL_API}/refreshtoken`, {
    headers: { "Content-Type": "application/json", refreshToken, username },
    withCredentials: true,
  });
  const at = data?.accessToken?.accessToken;
  const rt = data?.refreshToken?.refreshToken;
  if (at && rt) {
    set("accessToken", at);
    set("refreshToken", rt);
    if (data?.username) set("username", data.username);
    return at;
  }
  throw new Error("refresh failed");
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { response, config } = error || {};
    if (!response || !config) return Promise.reject(error);

    if (response.status === 401) {
      hardLogout();
      return Promise.reject(error);
    }

    if (response.status === 402 && !config._retry) {
      config._retry = true;
      try {
        if (!refreshPromise) refreshPromise = refreshTokens();
        const newAT = await refreshPromise;
        refreshPromise = null;
        config.headers["Authorization"] = `Bearer ${newAT}`;
        return api.request(config);
      } catch (e) {
        refreshPromise = null;
        hardLogout();
        return Promise.reject(e);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
