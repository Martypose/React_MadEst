import React from "react";
import "./assets/css/App.css";
import Nav from "./components/Nav";
import AnalisisProduccion from "./components/AnalisisProduccion";
import TablasNumeros from "./components/TablasNumeros";
import Estadisticas from "./components/Estadisticas";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/Login";
import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_URL_API;

// Configuración global de axios
axios.defaults.baseURL = process.env.REACT_APP_URL_API;

// Interceptor de axios para manejar la renovación de tokens y errores de autenticación
axios.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, simplemente la retornamos.
  (error) => {
    const { status } = error.response;
    if (status === 401) {
      // Si el token de acceso ha expirado o es inválido
      clearLocalStorage();
      redirectToLogin();
    } else if (status === 301 && !error.config._retry) {
      // Manejo de redirección, por ejemplo, podría ser un cambio de URL
      error.config._retry = true;
      return axios.request(error.config);
    } else if (status === 402 && !error.config._retry) {
      // Si el servidor retorna 402, podría ser un indicativo de que es necesario refrescar el token
      error.config._retry = true;
      return refreshAccessToken(error.config);
    }
    // Para otros tipos de errores, simplemente los rechazamos.
    return Promise.reject(error);
  }
);

// Función para limpiar el localStorage
const clearLocalStorage = () => {
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("username");
};

// Función para redirigir al Login
const redirectToLogin = () => {
  window.location = "/login";
};

// Función para refrescar el accessToken
const refreshAccessToken = (originalRequest) => {
  return axios
    .get(`${process.env.REACT_APP_URL_API}/refreshtoken`, {
      headers: {
        "Content-Type": "application/json",
        refreshToken: localStorage.getItem("refreshToken"),
        username: localStorage.getItem("username"),
      },
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem(
          "accessToken",
          response.data.accessToken.accessToken
        );
        localStorage.setItem(
          "refreshToken",
          response.data.refreshToken.refreshToken
        );
        localStorage.setItem("username", response.data.username);
        originalRequest.headers.accessToken =
          localStorage.getItem("accessToken");
        return axios.request(originalRequest);
      } else {
        clearLocalStorage();
        redirectToLogin();
      }
    })
    .catch((error) => {
      console.error(error);
      clearLocalStorage();
      redirectToLogin();
    });
};

function App() {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Login />;
  }

  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path="/estadisticas" exact component={Estadisticas} />
          <Route path="/cubico" component={AnalisisProduccion} />
          <Route path="/tablasnumero" component={TablasNumeros} />
          {/* Otras rutas y componentes */}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
