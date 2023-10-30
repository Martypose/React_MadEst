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

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("Error en llamada, comprobando cual es...");
    console.log(error.response);
    const originalRequest = error.config;
    if (error.response.status === 301 && !originalRequest._retry) {
      originalRequest._retry = true;
      return axios.request(error.config);
    }
    if (error.response.status === 402 && !originalRequest._retry) {
      originalRequest._retry = true;
      return axios
        .get(`${process.env.REACT_APP_URL_API}/refreshtoken`, {
          headers: {
            "Content-Type": "application/json",
            refreshToken: localStorage.getItem("refreshToken"),
            username: localStorage.getItem("username"),
          },
        })
        .then((response) => {
          console.log("pidiendo accesToken con refresh");
          if ("accessToken" in response.data) {
            console.log("me sirven los tokens");
            localStorage.setItem(
              "accessToken",
              response.data["accessToken"].accessToken
            );
            console.log(
              "nuevo tokenaccess: " + response.data["accessToken"].accessToken
            );
            localStorage.setItem(
              "refreshToken",
              response.data["refreshToken"].refreshToken
            );
            console.log(
              "nuevo refresh: " + response.data["refreshToken"].refreshToken
            );
            localStorage.setItem("username", response.data["username"]);
            error.config.headers.accessToken =
              localStorage.getItem("accessToken");
            return axios.request(error.config);
          } else {
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("username");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return Promise.reject(error);
  }
);

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
        </Switch>
      </Router>
    </div>
  );
}

export default App;
