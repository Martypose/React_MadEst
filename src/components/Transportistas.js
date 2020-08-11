import React, {useState,useEffect,useRef} from 'react';
function Transportistas() {

  const [transportistas, setTransportistas] = useState([]);
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchTransportistas();

        return() => montadoRef.current = false;
    },[]);


const fetchTransportistas = async () => {
    const data = await fetch('http://www.maderaexteriores.com/transporte/transportista');
    const transportistas = await data.json();
    if(montadoRef.current)
    setTransportistas(transportistas);

};

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
            return (<tr key={transportista.cif}>
              <td>{transportista.cif}</td>
              <td>{transportista.nombre}</td>
              <td>{transportista.direccion}</td>
              <td><img src='http://www.maderaexteriores.com/images/domingo.png' alt="firma del transportista"/></td>
              <td><button onClick={() => { }}>Ver conductores</button></td>
              </tr>); 
})}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default Transportistas;
