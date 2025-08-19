// src/auth/tokenStorage.js
const LS_KEY = 'auth.tokens.v1';

function base64urlDecode(b64u) {
  try {
    const b64 = b64u.replace(/-/g, '+').replace(/_/g, '/');
    const str = atob(b64.padEnd(b64.length + (4 - b64.length % 4) % 4, '='));
    return JSON.parse(decodeURIComponent(escape(str)));
  } catch { return null; }
}
function decodeJwt(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  return base64urlDecode(parts[1]);
}

export function getTokens() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
}
export function setTokens(apiResponse) {
  const access = apiResponse?.accessToken?.accessToken || null;
  const refresh = apiResponse?.refreshToken?.refreshToken || null;
  const payload = decodeJwt(access) || {};
  const t = {
    access,
    refresh,
    username: apiResponse?.username || payload?.name || null,
    role: apiResponse?.role || payload?.role || null,
  };
  localStorage.setItem(LS_KEY, JSON.stringify(t));
  return t;
}
export function clearTokens() { localStorage.removeItem(LS_KEY); }
export function getAccessToken() { return getTokens().access || null; }
export function getRefreshToken() { return getTokens().refresh || null; }
export function isExpired(token) {
  const p = decodeJwt(token);
  if (!p || !p.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return now >= p.exp;
}
export function emitLogout() { window.dispatchEvent(new CustomEvent('auth:logout')); }
