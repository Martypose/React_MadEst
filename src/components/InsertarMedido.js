import React, {useState,useEffect,useRef} from 'react';
import Select from 'react-select'
import swal from 'sweetalert';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import { useInput } from '../hooks/inputHook';

import axios from 'axios';

function InsertarMedido() {

  const [medidas, setMedidas] = useState([]);
  const [visible, setVisible] = useState();
  const [medidaElegida, setMedidaElegida] = useState(null);
  const [medidaElegidaCompleta, setMedidaElegidaCompleta] = useState(null);
  const [fechaCreacion, setFechaCreacion] = useState(null);
  const [fechaparseada, setFechaParseada] = useState(null);
 

  let [paquete, setPaquete] = useState(null);
  const [cantidades, setCantidades] = useState(Array(40));
  const [numpiezas,setNumpiezas] = useState(null);
  const [cubico,setCubico] = useState(null);
  
  const myRef = useRef([]);
myRef.current = [];

function addToRefs (el) {
  if (el && !myRef.current.includes(el)) {
    myRef.current.push(el);
  }
};

  paquete = {
    ID: 0,
    fechaCreacion: fechaparseada,
    estado: "stock",
    cantidades: cantidades,
    cubico: cubico,
    numpiezas: numpiezas,
    medida: medidaElegida,
    fechaBajado: null,
    fechaVenta: null
};







    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchMedidas();
        return() => montadoRef.current = false;
    },[]);

    const selectStyles = {
      menuPortal: base => ({ ...base, zIndex: 9999 }),
      menu: provided => ({ ...provided, zIndex: "9999 !important" })
  };


const fetchMedidas = async () => {
  axios.get(`${process.env.REACT_APP_URL_API}/medidas` ,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'accessToken': localStorage.getItem('accessToken')
    },
  }).then(response => {
    const medidas = response.data;

    let medidasParseadas= []


    medidas.map(medida => {
      if(medida.esMedible===1)
      medidasParseadas.push({value: medida.id, label: medida.id, grosor: medida.grosor, largo: medida.largo })
   
})

        if(montadoRef.current)
        setMedidas(medidasParseadas);
        console.log(medidasParseadas)

      });

};

const handleSubmit = (evt) => {
  evt.preventDefault();
if(fechaCreacion!=null && medidaElegida!=null){
  
  console.log(paquete)

  axios.post(`${process.env.REACT_APP_URL_API}/paquetes`,paquete ,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'accessToken': localStorage.getItem('accessToken')
    },
})
.then( (response) => { 
console.log(response)

if(response.status==200){
  swal("Success", response.data, "success", {
    buttons: false,
    timer: 2000,
  })

  document.getElementById('form-insert').reset();
  setFechaCreacion(null);
}
});


}else{

  swal("Por favor seleccione medida y fecha del paquete a insertar", {
    icon: "error",
    timer: 2000,
  });
}



}



/*

Para calcular el cubico del paquete

necesitamos el grosor y largo de la medida

y luego recorremos las cantidades y hacemos (numpiezas) * (ancho*grosor*largo) y vamos sumando al total


*/


function setearCantidades() {

let index = 8
let cubic = 0
let numpiezas = 0
let cantidadesTemp = []
myRef.current.forEach(input => {

  if(input.value!==''){
    let cantidad=parseInt(input.value, 10)
    cubic += ((index*10) * (medidaElegidaCompleta.grosor*10) * (medidaElegidaCompleta.largo))/1000000000
    cantidadesTemp.push(cantidad)
    numpiezas+=cantidad
  }else{
    cantidadesTemp.push(0)
  }

index++
})

setNumpiezas(numpiezas)
setCantidades(cantidadesTemp)
cubic = cubic.toFixed(3)
setCubico(cubic)
setPaquete(paquete)
console.log(cantidades)



}




function parseFecha(e){

  setFechaCreacion(e)

  let año = (e.year).toString()

  let mes
  if( e.month<10){
    mes = "0"+(e.month).toString()
  }else{
    mes = (e.month).toString()
  }

  let dia 
  if( e.day<10){
    dia = "0"+(e.day).toString()
  }else{
    dia = (e.day).toString()
  }

  let fechaParseada=año+mes+dia

  setFechaParseada(fechaParseada);
  setPaquete(paquete)
  console.log(paquete)

}

function handleChange(e) {
  myRef.current.forEach(input => {

    input.value=''
  })
  setearCantidades()
  setMedidaElegida(e.value)
  setMedidaElegidaCompleta(e)
  setPaquete(paquete)
  
}

const renderCustomInput = ({ ref }) => (
  <input
    type={'text'}
    readOnly
    ref={ref} // necessary
    placeholder="Elige la fecha"
    value={fechaCreacion ? `${fechaCreacion.day}/${fechaCreacion.month}/${fechaCreacion.year}` : ''}
    required // a styling class
  />
)

  return (
      
    <div className="contenido">

<form className='formulario' onSubmit={handleSubmit} id='form-insert'>
<label htmlFor="medidas">Elige una medida:</label>
<Select options={medidas} onChange={handleChange} styles={selectStyles}/>



<label htmlFor="datepicker">Elige una fecha:</label>
<DatePicker
      value={fechaCreacion}
      className='datepicker'
      onChange={e => { parseFecha(e) }}
      renderInput={renderCustomInput}
      shouldHighlightWeekends
      id='datepicker'
/>
<table>
            <tbody>
              <tr>
                <td className="ui header">Piezas</td>
                <td>
                {[...Array(40)].map((x, i) =>
                <input  key={i+8} type="text" value={i+8} className="inputsModoTabla" readOnly/>
                )}
                </td>
                <td>
                {[...Array(40)].map((x, i) =>
                <input  ref={addToRefs} key={i} type="number" placeholder='0' className="inputsModoTabla" onChange={setearCantidades}/>
                )}
                </td>
              </tr>
            </tbody>
        </table>
      <input type="submit" value="Submit" />
      </form>
      
    </div>
  );
}

export default InsertarMedido;
