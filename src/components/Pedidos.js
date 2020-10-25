import React, {useState,useEffect,useRef} from 'react';
import { useInput } from '../hooks/inputHook';

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
const data = await fetch('http://www.maderaexteriores.com/clientes',{
    method: 'GET',
    headers:{
      'Accept': 'application/json',
      'Authorization' : 'Martin',
      'Content-Type': 'application/json',
    }});
const clientes = await data.json();
if(montadoRef.current)
setClientes(clientes);
setClientesMostrar(clientes);
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
