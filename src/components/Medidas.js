import React, {useState,useEffect,useRef} from 'react';
import NameForm from './NuevaMedidaForm';
function Medidas() {

  const [medidas, setMedidas] = useState([]);
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchMedidas();

        return() => montadoRef.current = false;
    },[]);


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

function confirmacion() {
  if (window.confirm('Seguro que quieres eliminar esta medida?')){
    return true;
  }
  return false;

  
}

const  borrarMedida = async(id) =>{
  if(confirmacion()){

    await fetch(`http://www.maderaexteriores.com/medidas/${id}`, {
      method: "delete",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    })
    .then( (response) => { 
       console.log(response)
       fetchMedidas();
    });

  }
 
}

  return (
      

    <div className="medidas">
      <h1>Medidas</h1>
      <button onClick={nuevaMedida}>
      Nueva Medida
    </button>
    <div className="contenedor">
      <div className="tabla">
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
              
              <td>
                <button onClick={() => { borrarMedida(medida.id) }}>Borrar</button>
            </td>
          </tr>
              ))}
          </tbody>
        </table>
        </div>
        <div className="form">
        {visible && <NameForm fetch={fetchMedidas} />}
      </div>
      </div>
    </div>
  );
}

export default Medidas;
