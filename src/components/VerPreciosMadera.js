import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import { dameCliente } from "../utils/utils.js";

function PreciosMadera() {

    let [preciosMadera, setPreciosMadera] = useState([])
    let [preciosMaderaMostrar, setPreciosMostrar] = useState([])
    let [clienteElegido, setClienteElegido] = useState('Todos')
    let [clientes, setClientes] = useState([])


    const montadoRef = useRef(null)
    useEffect(() => {
        montadoRef.current = true
        fetchPreciosMadera()
        fetchClientes()
        return() => montadoRef.current = false
    },[]);

const fetchPreciosMadera = async () => {
  console.log('enviando peticion')
    axios.get(`${process.env.REACT_APP_URL_API}/preciosmadera` ,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'accessToken': localStorage.getItem('accessToken')
        },}).then(response => {
          console.log('hola')
          const preciosmadera = response.data
          console.log(preciosmadera)
          if(montadoRef.current)
          setPreciosMadera(preciosmadera)
          setPreciosMostrar(preciosmadera)
        });
};

const fetchClientes = async () => {
  axios.get(`${process.env.REACT_APP_URL_API}/clientes` ,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'accessToken': localStorage.getItem('accessToken')
      },}).then(response => {

        const clientes = response.data
        if(montadoRef.current)
        setClientes(clientes)
      });
};

function handleChange(e) {
  setClienteElegido(e.target.value);
  console.log(e.target.value)
  if (e.target.value === "Todos") {
    preciosMaderaMostrar = preciosMadera;
  } else {
    preciosMaderaMostrar = preciosMadera.filter(function (precioMadera) {
      return dameCliente(precioMadera.cliente,clientes).nombre=== e.target.value;
    });
  }
  setPreciosMostrar(preciosMaderaMostrar);
}

  return (
      
    <div className="contenido">



      <h1>Precios Madera</h1>
    <div className="contenedor">
      <div  className='fixed_header'>
  <h2>Mostrando precios del cliente {clienteElegido}</h2>
  <select name="clientes" id="selectclientes" onChange={handleChange}>
              <option key='Default' value="Todos">Todos</option>
          {clientes.map(cliente => {
            return (
            <option key={cliente.cif} value={cliente.nombre}>{cliente.nombre}</option>
            ); 
})}
          </select>
        <table className='tabla-datos'>
          <thead>
          <tr>
          <th>Cliente</th>
          <th>Medida</th>
          <th>Precio</th>
      </tr>
          </thead>
        <tbody>
        {preciosMaderaMostrar.map(precioMadera => {
                return (
              <tr key={precioMadera.cliente +""+precioMadera.medida}>
                <td>{dameCliente(precioMadera.cliente,clientes).nombre}</td>
                <td>{precioMadera.medida}</td>
                <td>{precioMadera.precio} €/m3</td>
              </tr>
              
              ); 
            }
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default PreciosMadera
