import React, {useState,useEffect,useRef} from 'react';
import swal from 'sweetalert';
import axios from 'axios';
import { Link } from 'react-router-dom';


function Clientes() {

  const [clientes, setClientes] = useState([]);

    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchClientes();

        return() => montadoRef.current = false;
    },[]);


const [visible, setVisible] = useState();

const fetchClientes = () => {
  console.log(localStorage.getItem('accessToken'))
  axios.get(`${process.env.REACT_APP_URL_API}/clientes`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'accessToken': localStorage.getItem('accessToken')
      },
    }).then(response => {
      const clientes = response.data;
      if(montadoRef.current)
      setClientes(clientes);
    });

};

const  verDetalles = async(cif) =>{

}
  return (
    <div className="contenido">
      <h1>Clientes</h1>
    <div className="contenedor">
    <div  className='fixed_header'>
        <table className='tabla-datos'>
        <thead>
        <tr>
          <th>Cif</th>
          <th>Nombre</th>
          <th>Direccion</th>
          <th>Teléfono</th>
          <th>Detalles</th>
      </tr>
        </thead>
        <tbody>
        {clientes.map(cliente => {
            return (<tr key={cliente.cif}>
              <td>{cliente.cif}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.direccion}</td>
              <td>{cliente.telefono}</td>
              <td><Link
  to={{
    pathname: "/detallescliente",
    state: {
    cliente
    },
  }}
>
  <button onClick={this}>Detalles</button>
</Link></td>
          </tr>); 
})}
          </tbody>
        </table>
        </div>
        </div>
      </div>
  );
}

export default Clientes;
