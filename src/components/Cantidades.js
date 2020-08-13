import React from "react";

function Cantidades(props) {
    var array = JSON.parse("[" + props.cantidades + "]");
    return (
        <div className="tabla">
        <table>
        <tbody>
        <tr>
                <th>Número</th>
                <th>Cantidad</th>
      </tr>
      {array.map((cantidad, i) => {
          if(cantidad!==0){
            return(<tr key={i+8}>
                <td>{i+8}</td>
                <td>{cantidad}</td>
            </tr>);
          }
          else{
              return null;
          }
           
      })}
          </tbody>
        </table>
        </div>
    );
  }
  export default Cantidades;