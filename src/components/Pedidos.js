import React, {useState,useEffect,useRef} from 'react';
import { useInput } from '../hooks/inputHook';
import axios from 'axios';

function Pedidos() {
const { value:Escritura} = useInput('');
const [clientes, setClientes] = useState([]);
const [valor, setValor] = useState('');
const montadoRef = useRef(null);
useEffect(() => {
    montadoRef.current = true;
    fecthClientes();
            return() => montadoRef.current = false;
},[]);

const fecthClientes = async () => {
axios.get(`${process.env.REACT_APP_URL_API}/clientes`, {
    headers:{
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'accessToken': localStorage.getItem('accessToken')
    },
  }).then(response => {
      const clientes = response.data
      if(montadoRef.current)
      setClientes(clientes);
      setClientesMostrar(clientes);
    });



};
  const [clientesMostrar, setClientesMostrar] = useState(clientes);
    useEffect(() => {
            const clientesEncontrados = clientes.filter(cliente =>
              cliente.nombre.toLowerCase().includes(valor.toLowerCase()));
            setClientesMostrar(clientesEncontrados);
          
        },[valor]);

    const onChangeHandler = (e) => {
            console.log(e.target.value);
            setValor(e.target.value);
    }

   



  return (
      
    <div className="contenido">
        <label>
          Escribe:
          <input type="text" {...Escritura} onChange={onChangeHandler} />
        </label>
        <h1>{valor}</h1>

        <ul>
         {clientesMostrar.map(cliente => (
          <li><button>{cliente.nombre}</button></li>
        ))}
      </ul>
    </div>
  );
}

export default Pedidos;
