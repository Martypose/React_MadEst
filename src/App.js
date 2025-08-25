// src/App.js
import React from "react";
import "./assets/css/App.css";
import Nav from "./components/Nav";
import AnalisisProduccion from "./components/AnalisisProduccion";
import TablasNumeros from "./components/TablasNumeros";
import Estadisticas from "./components/Estadisticas";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Login from "./components/Login";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path="/login" exact component={Login} />
          <ProtectedRoute path="/estadisticas" exact component={Estadisticas} />
          <ProtectedRoute path="/cubico" component={AnalisisProduccion} />
          <ProtectedRoute path="/tablasnumero" component={TablasNumeros} />
          <Redirect to="/cubico" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
