// src/components/Nav.js
import React from "react";
import "../assets/css/App.css";
import swal from "sweetalert";
import { menuItems } from "../menuItems";
import MenuItems from "./MenuItems";
import { AuthService } from "../lib/AuthService";

function Nav() {
  function logOut() {
    swal({
      title: "¿Seguro que quieres salir de la app?",
      text: "Tendrás que iniciar sesión la próxima vez que vuelvas",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((salir) => {
      if (salir) {
        swal(`Chao ${AuthService.username()}`, { icon: "success", timer: 1200, buttons: false })
          .then(() => AuthService.logout());
      }
    });
  }

  return (
    <nav>
      <ul className="menus">
        {menuItems.map((menu, index) => <MenuItems items={menu} key={index} />)}
      </ul>
      <button className="Salir" onClick={logOut}>Salir</button>
    </nav>
  );
}

export default Nav;
