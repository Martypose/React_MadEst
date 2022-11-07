import React, {useState,useEffect,useRef} from 'react'
import { useLocation } from 'react-router-dom'
import swal from 'sweetalert'
import axios from 'axios'
import { useHistory } from "react-router-dom";
import { useInput } from '../hooks/inputHook';


function DetallesCliente(props) {

    let history = useHistory();
    const { state } = useLocation();

    let [cliente, setCliente] = useState(state.cliente);
    let [clienteCambios, setClienteCambios] = useState(cliente);
    const { value:nombre, bind:bindNombre, reset:resetNombre } = useInput(cliente.nombre);
    const { value:direccion, bind:bindDireccion, reset:resetDireccion } = useInput(cliente.direccion);
    const { value:telefono, bind:bindTelefono, reset:resetTelefono } = useInput(cliente.telefono);

    clienteCambios = {
      cif: cliente.cif,
      nombre: nombre,
      direccion: direccion,
      telefono: telefono
  };
    const montadoRef = useRef(null);
    useEffect(() => {
        
        montadoRef.current = true;

        return() => montadoRef.current = false;
      
    },[]);


    const  borrarCliente = async(cliente) =>{

      swal({
        title: "¿Seguro que quieres eliminar esta cliente?",
        text: "Una vez eliminada no podrá ser recuperado",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
          console.log('vamos a borrar cliente')
          axios.delete(`${process.env.REACT_APP_URL_API}/clientes/${cliente.cif}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'accessToken': localStorage.getItem('accessToken')
            },
          })
          .then( (response) => { 
             console.log(response)
             swal("Cliente Eliminado", {
              icon: "success",
            });

            history.goBack()
            
          });


      
 
        } else {
          swal("Cliente no eliminado");   
        }
      });
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();

        axios.put(`${process.env.REACT_APP_URL_API}/clientes`,clienteCambios ,{
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
    
    
        setCliente(clienteCambios)
        })


    }

    


  return (
    
    <div className="contenido">

<form className='formulario' onSubmit={handleSubmit}>
<table className='tabla-datos'>
<thead>
          <tr>
          <th><h1>DETALLES DEL Cliente</h1></th>
          </tr>


          </thead>
        <tbody>      
        <tr>
          <td>Cif</td>
          <th>{cliente.cif}</th>
          </tr>
          
          <tr>
          <td>Nombre</td>
          <th><input type="text" {...bindNombre} required/></th>
          </tr>

          <tr>
          <td>Direccion</td>
          <th><input type="text" {...bindDireccion} required/></th>
          </tr>

          <tr>
          <td>Telefono</td>
          <th><input type="text" {...bindTelefono} required/></th>
          </tr>

          <tr>
          <td><button type="button" onClick={() => { borrarCliente(cliente) }}>Borrar Cliente</button></td>
          <th><input type="submit" value="Editar Cliente"/></th>
          </tr>      

      </tbody>
      
        </table>
</form> 
    
    
    </div>
  );
}

export default DetallesCliente;
