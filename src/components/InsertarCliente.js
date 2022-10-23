import React, {useState,useEffect,useRef} from 'react'
import swal from 'sweetalert'
import axios from 'axios'
import { useInput } from '../hooks/inputHook'

function InsertarCliente() {

    const { value:cif, bind:bindCif, reset:resetCif } = useInput('')
    const { value:nombre, bind:bindNombre, reset:resetNombre } = useInput('')
    const { value:direccion, bind:bindDireccion, reset:resetDireccion } = useInput('')
    const { value:telefono, bind:bindTelefono, reset:resetTelefono } = useInput('')

  let [cliente, setCliente] = useState(null);

  cliente = {
    cif: cif,
    nombre: nombre,
    direccion: direccion,
    telefono: telefono
};



    const montadoRef = useRef(null);

    useEffect(() => {
        montadoRef.current = true;
        return() => montadoRef.current = false;
    },[]);


const handleSubmit = (evt) => {
  evt.preventDefault();
  console.log(cliente)
  axios.post(`${process.env.REACT_APP_URL_API}/clientes`,cliente ,{
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

  resetCif()
  resetNombre()
  resetDireccion()
  resetTelefono()

}else{
  swal("error", response.data, "error", {
    buttons: false,
    timer: 2000,
  })


}
})
}

return (

    <div className="contenido">
      <h1>Insertar Cliente</h1>
    <form className='formulario' id='form-insert' onSubmit={handleSubmit}>
      <label>
        Cif:
        <input type="text" {...bindCif} required/>
      </label>
      <label>
        Nombre:
        <input type="text" {...bindNombre} required/>
      </label>
      <label>
        Direccion:
        <input type="text" {...bindDireccion} required/>
      </label>
      <label>
        Telefono:
        <input type="number" {...bindTelefono} required/>
      </label>
      <input type="submit" value="Submit" />
    </form>
    </div>
  )
}

export default InsertarCliente;
