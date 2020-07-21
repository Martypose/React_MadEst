import React, {useState,useEffect,useRef} from 'react';
import NameForm from './NuevaMedidaForm';
function Medidas() {
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchMedidas();

        return() => montadoRef.current = false;
    }, []);

const [medidas, setMedidas] = useState([]);
const [visible, setVisible] = useState();

const fetchMedidas = async () => {
    const data = await fetch('http://www.maderaexteriores.com/medidas');
    const medidas = await data.json();
    if(montadoRef.current)
    setMedidas(medidas);

};

function nuevaMedida(){
  setVisible(visible ? false : true); 
  console.log(visible);

}

  return (
      

    <div>
      <h1>Medidas</h1>
      <button onClick={nuevaMedida}>
      Nueva Medida
    </button>
    <div>
    {visible && <NameForm />}
    </div>
      <table>
      <tbody>
      <tr>
        <th>ID</th>
        <th>Ancho</th>
        <th>Grosor</th>
        <th>Largo</th>
    </tr>
      
      {medidas.map(medida => (
        <tr key={medida.id}>
            <td>{medida.id}</td>
            <td>{medida.ancho}</td>
            <td>{medida.grosor}</td>
            <td>{medida.largo}</td>
            
            <td><button onClick={nuevaMedida}>
Borrar    </button></td>
        </tr>
            ))}
        
        </tbody>
      </table>
    
    </div>
  );
}

export default Medidas;
