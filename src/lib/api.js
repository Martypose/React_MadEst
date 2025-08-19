// src/lib/api.js
import axios from "axios";
import AuthService from "./AuthService";

const API_BASE = process.env.REACT_APP_URL_API;

export const authless = axios.create({ baseURL: API_BASE, timeout: 30000 });

let isRefreshing = false;
let waiters = []; // {resolve,reject}

function setAuthHeader(config) {
  const token = AuthService.getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
}

async function refreshOnce() {
  if (isRefreshing) {
    return new Promise((resolve, reject) => waiters.push({ resolve, reject }));
  }
  isRefreshing = true;
  try {
    const resp = await authless.get(`/refreshtoken`, {
      headers: {
        "Content-Type": "application/json",
        refreshToken: AuthService.getRefreshToken(),
        username: AuthService.getUsername(),
      },
    });
    if (!resp?.data?.accessToken || !resp?.data?.refreshToken) {
      throw new Error("Respuesta de refresh inválida");
    }
    AuthService.setTokens(resp.data);
    waiters.forEach(w => w.resolve());
  } catch (err) {
    waiters.forEach(w => w.reject(err));
    throw err;
  } finally {
    isRefreshing = false;
    waiters = [];
  }
}

function hardLogout() {
  AuthService.clear();
  window.location.replace("/login");
}

export const api = axios.create({ baseURL: API_BASE, timeout: 30000 });

api.interceptors.request.use(setAuthHeader);

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const resp = error?.response;
    const cfg  = error?.config || {};
    if (!resp) return Promise.reject(error);

    if (resp.status === 401) {
      hardLogout();
      return Promise.reject(error);
    }
    if (resp.status === 402 && !cfg.__isRetryRequest) {
      cfg.__isRetryRequest = true;
      try {
        await refreshOnce();
        setAuthHeader(cfg);
        return api.request(cfg);
      } catch (e) {
        hardLogout();
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);
