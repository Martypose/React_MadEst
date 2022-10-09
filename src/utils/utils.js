export function dameCalidad(paquete, medidas){

    let calidad;

    medidas.filter(medida => medida.id===paquete.medida).map(medida => (
    
      
       calidad=medida.calidad
    ))
  
    return calidad;

}