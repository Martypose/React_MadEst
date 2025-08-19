// src/App.test.js
import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

test("renderiza Login cuando no autenticado", () => {
  localStorage.clear();
  const { getByText } = render(
    <MemoryRouter initialEntries={["/cubico"]}>
      <App />
    </MemoryRouter>
  );
  // asumiendo que el Login muestra algún texto distintivo
  expect(getByText(/login/i)).toBeInTheDocument();
});
