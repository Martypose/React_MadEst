import React, {useState,useEffect,useRef} from 'react';
import { useInput } from '../hooks/inputHook';

function Pedidos() {
const { value:Escritura, bind:bindEscritura, reset:resetEscritura } = useInput('');
  const [valor, setValor] = useState('');
  const usuarios = [
    'Martín','Juan','Pedro','Mauri', 'María', 'Raúl', 'Martina'
];
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
