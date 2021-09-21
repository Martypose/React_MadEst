import React, {useState,useEffect,useRef} from 'react';
import SelectMedidas from './FiltrosPaquetes';
import PopupExample from './modalExample';
function Paquetes() {

  const [paquetes, setPaquetes] = useState([]);
  const [visible, setVisible] = useState();
  const [cantidades, setCantidades] = useState([]);
  const [cantidadAnterior, setCantidadAnterior] = useState([]);
  const [medidaElegida, setMedidaElegida] = useState('Todas');
  const [estadoElegido, setEstadoElegido] = useState('Ninguno');
  const [calidadElegida, setCalidadElegida] = useState('Ninguno');
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

function selectorPaquetes(medida=medidaElegida, estado=estadoElegido, calidad=calidadElegida){
  if(montadoRef.current){
    setVisible(false);
    setMedidaElegida(medida);
    let paquetesMostrar;
    if(medida==='Todas'){
      paquetesMostrar=paquetes;
    }else{
      paquetesMostrar=(paquetes.filter(function(paquete){
        return paquete.medida===medida;
      }))
    }
    setPaquetesMostrar(paquetesMostrar);

    setEstadoElegido(estado);
    let paquetesMostrarEstados;
    if(estado==='Ninguno'){
      paquetesMostrarEstados=paquetesMostrar;
    }else{
      paquetesMostrarEstados=(paquetesMostrar.filter(function(paquete){
        return paquete.estado===estado;
      }))
    }
setPaquetesMostrar(paquetesMostrarEstados)

setCalidadElegida(calidad);
    let paquetesMostrarCalidades;
    if(calidad==='Ninguno'){
      paquetesMostrarCalidades=paquetesMostrarEstados;
    }else{
      paquetesMostrarCalidades=(paquetesMostrarEstados.filter(function(paquete){
        console.log(paquete.calidad);
        return paquete.calidad===calidad;
      }))
    }
    setPaquetesMostrar(paquetesMostrarCalidades);
}
}

let medidaMostrar = (medida) =>{
  selectorPaquetes(medida,undefined,undefined);
 }

 let estadoMostrar = (estado) =>{
    selectorPaquetes(undefined,estado,undefined);
 }
 let calidadMostrar = (calidad) =>{
   selectorPaquetes(undefined,undefined,calidad);
 }

  return (
      
    <div className="contenido">
      <h1>Paquetes</h1>
    <SelectMedidas medidaMostrar={medidaMostrar} estadoMostrar={estadoMostrar} calidadMostrar={calidadMostrar}/>
    <div className="contenedor">
      <div  className='fixed_header'>
  <h2>Hay {paquetesMostrar.length} paquetes de {medidaElegida}</h2>
        <table className='tabla-datos'>
          <thead>
          <tr>
          <th>ID</th>
          <th>MEDIDA</th>
          <th>FECHA</th>
          <th>ESTADO</th>
          <th>Nº Piezas</th>
          <th>Cúbico</th>
          <th>Piezas</th>
      </tr>
          </thead>
        <tbody>
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
                  <PopupExample cantidades={paquete.cantidades}/>
               {/*  <button onClick={() => { verCantidades(paquete.cantidades) }}>Ver Piezas</button> */}
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
      </div>
    </div>
  );
}

export default Paquetes;
