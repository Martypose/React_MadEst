import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
 
function PopupExample(props){

    var array = JSON.parse("[" + props.cantidades + "]");

    return(
        <Popup trigger={<button>Ver Piezas</button>} position="top left">
        {close => (
          <div>
           <div className="tabla">
        <table>
        <tbody>
        <tr>
                <th>Número</th>
                <th>Cantidad</th>
      </tr>
      {array.map((cantidad, i) => {
        console.log(cantidad+"-"+i)
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

          </div>
        )}
      </Popup>



    );
}


export default  PopupExample;