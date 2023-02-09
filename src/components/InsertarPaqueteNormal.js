import React, {useState,useEffect,useRef} from 'react';
import Select from 'react-select'
import SelectMedidas from './FiltrosPaquetes';
import PopupCantidades from '../utils/PopupCantidades';
import swal from 'sweetalert';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import axios from 'axios';
import { useInput } from '../hooks/inputHook';
function InsertarNormal() {

  const [medidas, setMedidas] = useState([]);
  const [visible, setVisible] = useState();
  const [medidaElegida, setMedidaElegida] = useState(null);
  const [medidaPaquete, setMedidaPaquete] = useState(null);
  const [cubico, setCubico] = useState(0);

  const [fechaCreacion, setFechaCreacion] = useState(null);
  const [fechaparseada, setFechaParseada] = useState(null);
  const { value:numpiezas, bind:bindNumpiezas, reset:resetNumpiezas } = useInput('');
  let [paquete, setPaquete] = useState(null);

  paquete = {
    ID: 0,
    fechaCreacion: fechaparseada,
    estado: "stock",
    cantidades: null,
    cubico: cubico,
    numpiezas: numpiezas,
    medida: medidaPaquete,
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
      medidasParseadas.push({value: medida.id, label: medida.id,ancho:medida.ancho, grosor: medida.grosor, largo: medida.largo , homogeneo: medida.homogeneo})
   
})

        if(montadoRef.current)
        setMedidas(medidasParseadas);
        console.log(medidasParseadas)

      });

};

const handleSubmit = (evt) => {
  evt.preventDefault();
if(fechaCreacion!=null && medidaElegida!=null){
  //console.log(((parseInt(medidaElegida.ancho)*parseInt(medidaElegida.grosor)*parseInt(medidaElegida.largo))/1000000000)*numpiezas)
 // paquete.cubico=(((parseInt(medidaElegida.ancho)*parseInt(medidaElegida.grosor)*parseInt(medidaElegida.largo))/1000000000)*numpiezas).toFixed(3)
 calculaCubico()
  console.log(paquete.cubico)
  paquete.numpiezas = parseInt(numpiezas)
  parseFecha()

  axios.post(`${process.env.REACT_APP_URL_API}/paquetes`,paquete ,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'accessToken': localStorage.getItem('accessToken')
    },
})
.then( (response) => { 
console.log(response)
resetNumpiezas()
setVisible(false)
setMedidaElegida(null)
document.getElementById('form-insert').reset();
if(response.status==200){
  swal("Success", response.data, "success", {
    buttons: false,
    timer: 2000,
  })


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

function parseFecha(){

  let año = (fechaCreacion.year).toString()

  let mes
  if( fechaCreacion.month<10){
    mes = "0"+(fechaCreacion.month).toString()
  }else{
    mes = (fechaCreacion.month).toString()
  }

  let dia 
  if( fechaCreacion.day<10){
    dia = "0"+(fechaCreacion.day).toString()
  }else{
    dia = (fechaCreacion.day).toString()
  }

  let fechaParseada=año+mes+dia


  setFechaParseada(fechaParseada);
  paquete.fechaCreacion = fechaParseada
  setPaquete(paquete)

}

function handleChange(e) {
setMedidaElegida(e)
setMedidaPaquete(e.value)
console.log(e)
  if(e.homogeneo===1){
    setVisible(true)
  }else{
    setVisible(false)
  }
  

  setPaquete(paquete)
}

function calculaCubico(){

let cubico = 0
  cubico=((medidaElegida.ancho*medidaElegida.grosor*medidaElegida.largo)/1000000000)*numpiezas

  paquete.cubico=cubico.toFixed(3)
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
<Select options={medidas} onChange={handleChange} styles={selectStyles} value={medidaElegida}/>

{visible && <label htmlFor="piezas">Nº Piezas:</label>}
{visible && <input type="number" {...bindNumpiezas} required /> }
<label htmlFor="datepicker">Elige una fecha:</label>
<DatePicker
      value={fechaCreacion}
      className='datepicker'
      onChange={setFechaCreacion}
      renderInput={renderCustomInput}
      shouldHighlightWeekends
      id='datepicker'
/>
     
      <input type="submit" value="Submit" />
</form>
      
    </div>
  );
}

export default InsertarNormal;
