// src/lib/AuthService.js
import { api } from "./api";

const AuthService = {
  async login({ name, password }) {
    const { data } = await api.post("/login", { name, password });
    const at = data?.accessToken?.accessToken;
    const rt = data?.refreshToken?.refreshToken;

    if (at && rt) {
      localStorage.setItem("accessToken", at);
      localStorage.setItem("refreshToken", rt);
      if (data?.username) localStorage.setItem("username", data.username);
      return { ok: true, username: data?.username || name };
    }
    return { ok: false, error: data?.message || data?.error || "Credenciales inválidas" };
  },

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    window.location.assign("/login");
  },

  isAuthenticated() {
    return !!localStorage.getItem("accessToken");
  },

  username() {
    return localStorage.getItem("username") || "";
  },
};

// Export nombrado y por defecto (para soportar ambos patrones de import)
export { AuthService };
export default AuthService;
