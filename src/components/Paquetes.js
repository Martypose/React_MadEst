import React, {useState,useEffect,useRef} from 'react';
import Cantidades from './Cantidades';
import SelectMedidas from './SelectMedidas';
function Paquetes() {

  const [paquetes, setPaquetes] = useState([]);
  const [visible, setVisible] = useState();
  const [cantidades, setCantidades] = useState([]);
  const [cantidadAnterior, setCantidadAnterior] = useState([]);
  const [medidaElegida, setMedidaElegida] = useState('Todas');
  const [paquetesMostrar, setPaquetesMostrar] = useState(paquetes);



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
    setPaquetesMostrar(paquetes);

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

let medidaMostrar = (medida) =>{
  if(montadoRef.current){
    setMedidaElegida(medida);
    let paquetesMostrar;
    if(medida==='Todas'){
      paquetesMostrar=paquetes;
    }else{
      paquetesMostrar=(paquetes.filter(function(paquete){
        return paquete.medida===medida;
      }))
    }

setPaquetesMostrar(paquetesMostrar)}
 }

  return (
      
    <div className="contenido">
      <h1>Paquetes</h1>
    <SelectMedidas medidaMostrar={medidaMostrar}/>
    <div className="contenedor">
      <div className="tabla">
  <h2>Hay {paquetesMostrar.length} paquetes de {medidaElegida}</h2>
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
        
        {paquetesMostrar.map(paquete => {
            if(paquete.cantidades!=='0'){
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
        <div className="form">
        {visible && <Cantidades cantidades={cantidades}/> }
      </div>
      </div>
    </div>
  );
}

export default Paquetes;
