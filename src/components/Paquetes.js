import React, {useState,useEffect,useRef} from 'react';
import Cantidades from './Cantidades';
function Paquetes() {

  const [paquetes, setPaquetes] = useState([]);
  const [visible, setVisible] = useState();
  const [cantidades, setCantidades] = useState([]);
  const [cantidadAnterior, setCantidadAnterior] = useState([]);
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchPaquetes();

        return() => montadoRef.current = false;
    },[]);

const fetchPaquetes = async () => {
    const data = await fetch('http://www.maderaexteriores.com/paquetes',{
        method: 'GET',
        headers:{
          'Accept': 'application/json',
          'Authorization' : 'Martin',
          'Content-Type': 'application/json',
        }});
    const paquetes = await data.json();
    if(montadoRef.current)
    setPaquetes(paquetes);

};

function verCantidades(cantidades){
    if(cantidadAnterior===cantidades){
        setVisible(visible ? false : true);
    }else{
        setVisible(true);
    }
    setCantidades(cantidades);
    console.log(cantidades);
    setCantidadAnterior(cantidades);


}

  return (
      

    <div className="paquetes">
      <h1>Paquetes</h1>
    <div className="contenedor">
      <div className="tabla">
        <table>
        <tbody>
        <tr>
          <th>ID</th>
          <th>MEDIDA</th>
          <th>FECHA</th>
          <th>ESTADO</th>
          <th>Nº Piezas</th>
          <th>Cúbico</th>

      </tr>
        
        {paquetes.map(paquete => {
            if(paquete.cantidades!=null){
                return (<tr key={paquete.ID}>
                    <td>{paquete.ID}</td>
                  <td>{paquete.medida}</td>
                  <td>{paquete.fechaCreacion}</td>
                  <td>{paquete.estado}</td>
                  <td>{paquete.numpiezas}</td>
                  <td>{paquete.cubico}</td>
                  <td>
                <button onClick={() => { verCantidades(paquete.cantidades) }}>Ver Piezas</button>
            </td>
              </tr>); 
            }else{
                return (<tr key={paquete.ID}>
                    <td>{paquete.ID}</td>
                  <td>{paquete.medida}</td>
                  <td>{paquete.fechaCreacion}</td>
                  <td>{paquete.estado}</td>
                  <td>{paquete.numpiezas}</td>
                  <td>{paquete.cubico}</td>
              </tr>); 
            }
            
})}
          </tbody>
        </table>
        </div>
        <div className="cantidades">
        {visible && <Cantidades cantidades={cantidades}/> }
      </div>
      </div>
    </div>
  );
}

export default Paquetes;
