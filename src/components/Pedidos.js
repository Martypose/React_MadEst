import React, {useState,useEffect,useRef} from 'react';
import { useInput } from '../hooks/inputHook';

function Pedidos() {
const { value:Escritura, bind:bindEscritura, reset:resetEscritura } = useInput('');
const [clientes, setClientes] = useState([]);
const [valor, setValor] = useState('');
const usuarios = [
    'Martín','Juan','Pedro','Mauri', 'María', 'Raúl', 'Martina'
];

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
const paquetes = await data.json();

if(montadoRef.current)
setClientes(clientes);
};
  const [usuariosMostrar, setUsuariosMostrar] = useState(usuarios);
    useEffect(() => {
            const usuariosEntontrados = usuarios.filter(usuario =>
              usuario.toLowerCase().includes(valor.toLowerCase()));
            setUsuariosMostrar(usuariosEntontrados);
          
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
         {usuariosMostrar.map(usuario => (
          <li>{usuario}</li>
        ))}
      </ul>
    </div>
  );
}

export default Pedidos;
