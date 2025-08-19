// src/api/client.js
import axios from 'axios';
import {
  getAccessToken, getRefreshToken, setTokens,
  clearTokens, emitLogout, isExpired
} from '../auth/tokenStorage';

export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'; // tu backend: PORT=3001
//                                                   ^^^ ajusta a prod si procede
//                                                                                 :contentReference[oaicite:4]{index=4}

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 20000,
});

let refreshInFlight = null;

async function refreshTokens() {
  if (refreshInFlight) return refreshInFlight;
  const rt = getRefreshToken();
  if (!rt || isExpired(rt)) throw new Error('No refresh token');

  refreshInFlight = (async () => {
    try {
      // 🆕 primero intento estándar
      const { data } = await axios.post(`${API_BASE_URL}/refreshtoken`, { refreshToken: rt });
      return setTokens(data || {});
    } catch (e) {
      // ♻️ compat LEGACY: GET con header refreshToken (tu ruta actual)
      const { data } = await axios.get(`${API_BASE_URL}/refreshtoken`, {
        headers: { refreshToken: rt },
      });
      return setTokens(data || {});
    } finally {
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

// ——— inyecta Bearer si hay accessToken válido
client.interceptors.request.use((config) => {
  const at = getAccessToken();
  if (at && !isExpired(at)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${at}`;
  }
  return config;
});

// ——— reintento con refresh ante 401 (excepto en login/refresh)
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error || {};
    if (!response || response.status !== 401) return Promise.reject(error);

    const url = (config?.url || '').toLowerCase();
    if (config?._retry || url.includes('/login') || url.includes('/refreshtoken')) {
      return Promise.reject(error);
    }

    try {
      await refreshTokens();
      config._retry = true;
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${getAccessToken()}`;
      return client(config);
    } catch (e) {
      clearTokens();
      emitLogout();
      return Promise.reject(e);
    }
  }
);

export default client;
