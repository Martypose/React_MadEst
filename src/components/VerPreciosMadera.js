import React, {useState,useEffect,useRef} from 'react'
import axios from 'axios'

function PreciosMadera() {

    const [preciosMadera, setPreciosMadera] = useState([])
    const [preciosMaderaMostrar, setPreciosMostrar] = useState(preciosMadera)
    const [medidaElegida, setMedidaElegida] = useState('Todas')
    const [clienteElegido, setClienteElegido] = useState('Todos')


    const montadoRef = useRef(null)
    useEffect(() => {
        montadoRef.current = true
        fetchPreciosMadera()
        return() => montadoRef.current = false
    },[]);

const fetchPreciosMadera = async () => {
    axios.get(`${process.env.REACT_APP_URL_API}/preciosmaderas` ,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'accessToken': localStorage.getItem('accessToken')
        },}).then(response => {

          const preciosmadera = response.data
          if(montadoRef.current)
          setPreciosMadera(preciosmadera)
          setPreciosMostrar(preciosMadera)
        });
  
   

};

function selectorPrecios(medida=medidaElegida, cliente=clienteElegido){
  if(montadoRef.current){
    setVisible(false);
    setClienteElegido(cliente);
    let preciosMostrar;
    if(cliente==='Todos'){
      preciosMostrar=precios;
    }else{
      preciosMostrar=(preciosMadera.filter(function(precioMadera){
        return preciosMadera.cliente===cliente;
      }))
    }
    setPreciosMostrar(preciosMostrar);
}
}

let clienteMostrar = (cliente) =>{
  selectorPrecioMadera(undefined,cliente);
 }

  return (
      
    <div className="contenido">
      <h1>Precios Madera</h1>
    <div className="contenedor">
      <div  className='fixed_header'>
  <h2>Mostrando precios del cliente {clienteElegido} para medida: {medidaElegida} </h2>
        <table className='tabla-datos'>
          <thead>
          <tr>
          <th>Cliente</th>
          <th>Medida</th>
          <th>Precio</th>
      </tr>
          </thead>
        <tbody>
        {preciosMaderaMostrar.map(precioMadera => {
                return (<tr key={precioMadera.cliente}>
                    <td>{precioMadera.medida}</td>
                  <td>{precioMadera.precio}</td>
              </tr>); 
            }
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

export default PreciosMadera
