// src/lib/AuthService.js
class AuthService {
  static ACCESS_KEY  = "accessToken";
  static REFRESH_KEY = "refreshToken";
  static USER_KEY    = "username";

  static getAccessToken()  { return localStorage.getItem(this.ACCESS_KEY)  || ""; }
  static getRefreshToken() { return localStorage.getItem(this.REFRESH_KEY) || ""; }
  static getUsername()     { return localStorage.getItem(this.USER_KEY)    || ""; }

  // Acepta payloads anidados (login/refresh actuales) o planos
  static setTokens(payload) {
    const at = payload?.accessToken?.accessToken ?? payload?.accessToken ?? "";
    const rt = payload?.refreshToken?.refreshToken ?? payload?.refreshToken ?? "";
    const un = payload?.username ?? this.getUsername();
    if (at) localStorage.setItem(this.ACCESS_KEY, at);
    if (rt) localStorage.setItem(this.REFRESH_KEY, rt);
    if (un) localStorage.setItem(this.USER_KEY, un);
  }

  static clear() {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static isAuthenticated() { return !!this.getAccessToken(); }
}
export default AuthService;
