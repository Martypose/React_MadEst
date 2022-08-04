import React, {useState,useEffect,useRef} from 'react';
import SelectMedidas from './FiltrosPaquetes';
import PopupExample from './modalExample';
import swal from 'sweetalert';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import axios from 'axios';
import Paquetes from './VerPaquetes';
function InsertarNormal() {

  const [medidas, setMedidas] = useState([]);
  const [visible, setVisible] = useState();
  const [medidaElegida, setMedidaElegida] = useState(null);
  const [fechaCreacion, setFechaCreacion] = useState(null);
  const [fechaparseada, setFechaParseada] = useState(null);
  let [paquete, setPaquete] = useState(null);

  paquete = {
    ID: 0,
    fechaCreacion: fechaparseada,
    estado: "stock",
    cantidades: null,
    cubico: null,
    numpiezas: null,
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


const fetchMedidas = async () => {
  axios.get(`${process.env.REACT_APP_URL_API}/medidas` ,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'accessToken': localStorage.getItem('accessToken')
    },
  }).then(response => {
    const medidas = response.data;
        if(montadoRef.current)
        setMedidas(medidas);
        console.log(medidas)

      });

};

const handleSubmit = (evt) => {
  evt.preventDefault();
if(fechaCreacion!=null && medidaElegida!=null){
  parseFecha();
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
  setPaquete(paquete)
  console.log(paquete)

}

function handleChange(e) {
  setMedidaElegida(e.target.value);
  setPaquete(paquete)
}



  return (
      
    <div className="contenido">

<form className='formulario' onSubmit={handleSubmit} id='form-insert'>
<label htmlFor="medidas">Elige una medida:</label>
<select name="medidas" id="medidas" onChange={handleChange} required>
              <option key='Default' value="Seleccione medida">Seleccione medida</option>
          {medidas.map(medida => {
            return (
            <option key={medida.id} value={medida.id}>{medida.id}</option>
            ); 
})}
          </select>
          <DatePicker
      value={fechaCreacion}
      onChange={setFechaCreacion}
      inputPlaceholder="Elige un día"
      shouldHighlightWeekends
        id='datepicker'
      />

        <input type="submit" value="Submit" />
      </form>
      
    </div>
  );
}

export default InsertarNormal;
