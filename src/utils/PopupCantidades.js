import React from "react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";

function PopupCantidades(paquete) {
  var cantidades = JSON.parse("[" + paquete.cantidades + "]");

  return (
    <Popup trigger={<button>Ver Piezas</button>} position="top left">
      {(close) => (
        <div>
          <div className="tabla">
            <table>
              <tbody>
                <tr>
                  <th>Número</th>
                  <th>Cantidad</th>
                </tr>
                {cantidades.map((cantidad, numeroTabla) => {
                  if (cantidad !== 0) {
                    return (
                      <tr key={numeroTabla + 8}>
                        <td>{numeroTabla + 8}</td>
                        <td>{cantidad}</td>
                      </tr>
                    );
                  } else {
                    return null;
                  }
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Popup>
  );
}

export default PopupCantidades
