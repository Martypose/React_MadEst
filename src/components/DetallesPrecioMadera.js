import React, {useState,useEffect,useRef} from 'react'
import { useLocation } from 'react-router-dom'
import swal from 'sweetalert'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { useInput } from '../hooks/inputHook';


function DetallesPrecioMadera(props) {

    let history = useHistory();
    const { state } = useLocation();

    let [precioMadera, setPrecioMadera] = useState(state.precioMadera);
    let [precioMaderaCambios, setPrecioMaderaCambios] = useState(precioMadera);
    const { value:precio, bind:bindPrecio, reset:resetPrecio } = useInput(state.precioMadera.precio);

    precioMaderaCambios = {
      medida: precioMadera.medida,
      cliente: precioMadera.cliente,
      precio: precio,
  };
    const montadoRef = useRef(null);
    useEffect(() => {
        
        montadoRef.current = true;

        return() => montadoRef.current = false;
      
    },[]);


    const  borrarPrecio = async(precioMadera) =>{

      swal({
        title: "¿Seguro que quieres eliminar esta precio?",
        text: "Una vez eliminado no podrá ser recuperado",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          console.log('vamos a borrar precio')
          axios.delete(`${process.env.REACT_APP_URL_API}/preciosmadera/${precioMadera.medida, precioMadera.cliente}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'accessToken': localStorage.getItem('accessToken')
            },
          })
          .then( (response) => { 
             console.log(response)
             swal("Precio Eliminado", {
              icon: "success",
            });

            history.goBack()
            
          });


      
 
        } else {
          swal("Precio no eliminado");   
        }
      });
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();

        axios.put(`${process.env.REACT_APP_URL_API}/preciosmadera`,precioMaderaCambios ,{
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
    
    
        setPrecioMadera(precioMaderaCambios)
        })


    }

    


  return (
    
    <div className="contenido">

<form className='formulario' onSubmit={handleSubmit}>
<table className='tabla-datos'>
<thead>
          <tr>
          <th><h1>Detalles Precio</h1></th>
          </tr>


          </thead>
        <tbody>      
        <tr>
          <td>Cliente</td>
          <th>{precioMadera.cliente}</th>
          </tr>
          
          <tr>
          <td>Medida</td>
          <th>{precioMadera.medida}</th>
          </tr>

          <tr>
          <td>Precio €/m3</td>
          <th><input type="number" {...bindPrecio} required/></th>
          </tr>

          <tr>
          <td><button type="button" onClick={() => { borrarPrecio(precioMadera) }}>Borrar Precio</button></td>
          <th><input type="submit" value="Editar Precio"/></th>
          </tr>      

      </tbody>
      
        </table>
</form> 
    
    
    </div>
  );
}

export default DetallesPrecioMadera;
