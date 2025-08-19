// src/ProtectedRoute.jsx
import React from "react";
import { Route, Redirect } from "react-router-dom";
import AuthService from "./lib/AuthService";

export default function ProtectedRoute({ component: Cmp, ...rest }) {
  const authed = AuthService.isAuthenticated();
  return (
    <Route
      {...rest}
      render={(props) => authed ? <Cmp {...props} /> : <Redirect to="/login" />}
    />
  );
}
