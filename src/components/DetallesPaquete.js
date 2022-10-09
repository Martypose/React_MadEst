import React, {useState,useEffect,useRef} from 'react';
import { useLocation } from 'react-router-dom';
function DetallesPaquete(props) {

    const { state } = useLocation();
    let paquete = state.paquete
    let calidad = state.calidad
    const montadoRef = useRef(null);
    useEffect(() => {
        console.log(paquete.paquete)
        montadoRef.current = true;
        return() => montadoRef.current = false;
    },[]);

    


  return (
    
    <div className="contenido">


<table className='tabla-datos'>
        <tbody>
        <thead>
          <tr>
          <h1>DETALLES DEL PAQUETE</h1>
          </tr>
          </thead>
        
        <tr>
          <td>ID</td>
          <th>{paquete.ID}</th>
          </tr>
          
          <tr>
          <td>MEDIDA</td>
          <th>{paquete.medida}</th>
          </tr>
          
      
          
          <tr>
          <td>ESTADO</td>
          <th>{paquete.estado}</th>
          </tr>

          <tr>
          <td>FECHA CREACION</td>
          <th>{paquete.fechaCreacion}</th>
          </tr>
          
          <tr>
          <td>Nº Piezas</td>
          <th>{paquete.numpiezas}</th>
          </tr>
          
          <tr>
          <td>Cúbico</td>
          <th>{paquete.cubico}</th>

          </tr>
                    
          <tr>
          <td>Calidad</td>
          <th>{calidad}</th>
          </tr>
          
          <tr>
          <td>Pedido</td>
          </tr>
      

      </tbody>
        </table>
    
    
    </div>
  );
}

export default DetallesPaquete;
