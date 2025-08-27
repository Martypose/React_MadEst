// React_MadEst/src/components/Nav.js
import React from "react";
import "../assets/css/App.css";
import swal from "sweetalert";
import { menuItems } from "../menuItems";
import MenuItems from "./MenuItems";

function Nav() {
  function logOut() {
    swal({
      title: "¿Seguro que quieres salir de la app?",
      text: "Tendras que iniciar sesión la prómixa vez que vengas",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((salir) => {
      if (salir) {
        console.log("Saliendo de la app");
        swal(`Chao ${localStorage.getItem("username")}`, {
          icon: "success",
          timer: 2000,
          buttons: false,
        }).then(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken"); // ← añadido
          localStorage.removeItem("username");
          window.location.href = "/login";
        });
      } else {
        swal("Un poco más de trabajo");
      }
    });
  }

  return (
    <nav>
      <ul className="menus">
        {menuItems.map((menu, index) => {
          return <MenuItems items={menu} key={index} />;
        })}
      </ul>
      <button
        className="Salir"
        onClick={() => {
          logOut();
        }}
      >
        Salir
      </button>
    </nav>
  );
}

export default Nav;
