export function dameCalidad(paquete, medidas){

    let calidad;

    medidas.filter(medida => medida.id===paquete.medida).map(medida => (
    
      
       calidad=medida.calidad
    ))
  
    return calidad;

}

export function dameMedida(paquete, medidas){

    let medidaFinal
    medidas.filter(medida => medida.id===paquete.medida).map(medida => (


    medidaFinal = medida
    ))

    return medidaFinal

}