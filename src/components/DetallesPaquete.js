import React, {useState,useEffect,useRef} from 'react';
import { useLocation } from 'react-router-dom';
function DetallesPaquete(props) {

    const { state } = useLocation();
    let paquete = state.paquete
    const montadoRef = useRef(null);
    useEffect(() => {
        console.log(paquete.paquete)
        montadoRef.current = true;
        return() => montadoRef.current = false;
    },[]);

    


  return (
    
    <div className="contenido">
        <h1>{paquete.ID}</h1>
        <h1>{paquete.cantidades}</h1>
    </div>
  );
}

export default DetallesPaquete;
