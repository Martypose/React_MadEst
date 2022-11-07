import React, {useState,useEffect,useRef} from 'react';
import SelectMedidas from './FiltrosPaquetes';
import PopupExample from './modalExample';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { dameCalidad,dameMedida } from '../utils/utils.js';

function PreciosMadera() {

    const [preciosMadera, setPreciosMadera] = useState([]);
    const [paquetesMostrar, setPaquetesMostrar] = useState(paquetes);


    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchPreciosMadera();
        return() => montadoRef.current = false;
    },[]);

const fetchPreciosMadera = async () => {
    axios.get(`${process.env.REACT_APP_URL_API}/preciosmaderas` ,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'accessToken': localStorage.getItem('accessToken')
        },}).then(response => {

          const preciosmaderas = response.data;
          if(montadoRef.current)
          setPreciosMadera(preciosmadera);
          setPreciosMostrar(preciosMadera);
        });
  
   

};

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

      //filtrar el array de medidas, para aquellas cuya calidad sea la seleccionada, obtenemos un array con los ids de esas medidas
      let idMedidasCalidadSeleccionada = medidas.filter(medida => medida.calidad===calidad).map(medida => (
        medida.id
      ));

    //filtramos el arrary de paquetes a mostrar, quedandonos con aquellos paquetes cuyos IDS esten en el array de IDS de medidas que hemos filtrado antes
      paquetesMostrarCalidades = paquetesMostrarEstados.filter(paquete => idMedidasCalidadSeleccionada.includes(paquete.medida));

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
          <th>FECHA CREACION</th>
          <th>ESTADO</th>
          <th>Nº Piezas</th>
          <th>Cúbico</th>
          <th>Piezas</th>
          <th>Calidad</th>
          <th>Detalles</th>
      </tr>
          </thead>
        <tbody>
        {paquetesMostrar.map(paquete => {
            if(paquete.cantidades!=='0' && paquete.cantidades!==null){
                return (<tr key={paquete.ID}>
                    <td>{paquete.ID}</td>
                  <td>{paquete.medida}</td>
                  <td>{paquete.fechaCreacion}</td>
                  <td>{paquete.estado}</td>
                  <td>{paquete.numpiezas}</td>
                  <td>{paquete.cubico}</td>
                  <td>
                  <PopupExample cantidades={paquete.cantidades}/>
            </td>
        <td key={dameCalidad(paquete,medidas)}>{dameCalidad(paquete,medidas)}</td>

      <td><Link
  to={{
    pathname: "/detallespaquete",
    state: {
    paquete,
    medida: dameMedida(paquete,medidas)

    },
  }}
>
  <button onClick={this}>Detalles</button>
</Link></td>
              </tr>); 
            }else{
                return (<tr key={paquete.ID}>
                    <td>{paquete.ID}</td>
                  <td>{paquete.medida}</td>
                  <td>{paquete.fechaCreacion}</td>
                  <td>{paquete.estado}</td>
                  <td>{paquete.numpiezas}</td>
                  <td>{paquete.cubico}</td>
                  <td></td>
                  <td key={dameCalidad(paquete,medidas)}>{dameCalidad(paquete,medidas)}</td>
                  <td><Link
  to={{
    pathname: "/detallespaquete",
    state: {
    paquete,
    medida: dameMedida(paquete,medidas)

    },
  }}
>
  <button onClick={this}>Detalles</button>
</Link></td>
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

export default PreciosMadera;
