import React, {useState,useEffect,useRef} from 'react';
import Conductores from './Conductores';
function Transportistas() {
  const [transportistas, setTransportistas] = useState([]);
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchTransportistas();

        return() => montadoRef.current = false;
    },[]);

    const [visible, setVisible] = useState();
    const [transporte, setTransporte] = useState();

const fetchTransportistas = async () => {
    const data = await fetch('http://www.maderaexteriores.com/transporte/transportista',{
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }});
    const transportistas = await data.json();
    if(montadoRef.current)
    setTransportistas(transportistas);

};

function verConductores(t){
  setVisible(visible ? false : true);
  setTransporte(t);
  console.log(visible);
}


  return (
    
    <div className="transportistas">
      <h1>Transportistas</h1>

    <div className="contenedor">
      <div className="tabla">
        <table>
        <tbody>
        <tr>
          <th>CIF</th>
          <th>Nombre</th>
          <th>Dirección</th>
          <th>Firma</th>
      </tr>
        
        {transportistas.map(transportista => {
          let imagen = 'http://www.maderaexteriores.com/images/'+ transportista.firma;
            return (<tr key={transportista.cif}>
              <td>{transportista.cif}</td>
              <td>{transportista.nombre}</td>
              <td>{transportista.direccion}</td>
              <td><img src={imagen} alt="firma del transportista"/></td>
              <td><button onClick={() => {verConductores(transportista.nombre)}}>Ver conductores</button></td>
              </tr>); 
})}
          </tbody>
        </table>
        </div>
        <div className="form">
        {visible && <Conductores transportista={transporte} />}
      </div>
   
      </div>
    </div>
  );
}

export default Transportistas;
