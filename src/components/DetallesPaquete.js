import React, {useState,useEffect,useRef} from 'react'
import { useLocation } from 'react-router-dom'
import swal from 'sweetalert'
import axios from 'axios'

function DetallesPaquete(props) {

    const { state } = useLocation();
    let medida = state.medida

    let [paquete, setPaquete] = useState(state.paquete);
    let [paqueteCambios, setPaqueteCambios] = useState(paquete);

    paqueteCambios = {
      ID: paquete.ID,
      fechaCreacion: paquete.fechaCreacion,
      estado: paquete.estado,
      cantidades: paquete.cantidades,
      cubico: paquete.cubico,
      numpiezas: paquete.numpiezas,
      medida: paquete.medida,
      fechaBajado: paquete.fechaBajado,
      fechaVenta: paquete.fechaVenta
  };
    const montadoRef = useRef(null);
    useEffect(() => {
        
        montadoRef.current = true;

        return() => montadoRef.current = false;
      
    },[]);


    function ponerBajado(paquete){

      let date = new Date();
	    let fechaHoy = date.getFullYear()+""+(date.getMonth()+1)+""+ date.getDate();

      paqueteCambios.fechaBajado = fechaHoy
      paqueteCambios.estado='bajado'

      setPaqueteCambios(paqueteCambios)

      axios.put(`${process.env.REACT_APP_URL_API}/paquetes`,paqueteCambios ,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'accessToken': localStorage.getItem('accessToken')
        },
    })
    .then( (response) => { 
    console.log(response)
    if(response.status==200){
      swal("Success", response.data, "success", {
        buttons: false,
        timer: 2000,
      })
    }


    setPaquete(paqueteCambios)
    });






    }

    function esBajable(paquete){

      let bajable = false

      if(paquete.fechaBajado==null){
        bajable = true
      }
      
      if(bajable){
        return(
          <th><button onClick={() => { ponerBajado(paquete.id) }}>Bajar</button></th>
                )


      }else{
        return(
          <th>{paquete.fechaBajado}</th>
                )

      }
      

    }

    


  return (
    
    <div className="contenido">


<table className='tabla-datos'>
<thead>
          <tr>
          <th><h1>DETALLES DEL PAQUETE</h1></th>
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
          {esBajable(paquete)}
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
