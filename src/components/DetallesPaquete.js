import React, {useState,useEffect,useRef} from 'react';
import { useLocation } from 'react-router-dom';
function DetallesPaquete(props) {

    const { state } = useLocation();
    let paquete = state.paquete
    let medida = state.medida
    const montadoRef = useRef(null);
    useEffect(() => {
        
        montadoRef.current = true;

        return() => montadoRef.current = false;
      
    },[]);


    function ponerBajado(paquete){



    }

    


  return (
    
    <div className="contenido">


<table className='tabla-datos'>
<thead>
          <tr>
          <h1>DETALLES DEL PAQUETE</h1>
          </tr>


          </thead>
        <tbody>        
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

          {(medida.homogeneo==0 && (paquete.numpiezas==null || paquete.numpiezas==0)) ? <tr>
          <td>FECHA BAJADO</td>
          <th>{paquete.fechaBajado}</th>
          </tr> : null}
          
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
          <th>{medida.calidad}</th>
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
