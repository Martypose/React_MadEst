import React, {useState,useEffect,useRef} from 'react';
import SelectMedidas from './FiltrosPaquetes';
import PopupExample from './modalExample';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import axios from 'axios';
import Paquetes from './VerPaquetes';
function InsertarNormal() {

  const [medidas, setMedidas] = useState([]);
  const [visible, setVisible] = useState();
  const [medidaElegida, setMedidaElegida] = useState('Todas');
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
  parseFecha();
  evt.preventDefault();
  axios.post(`${process.env.REACT_APP_URL_API}/paquetes`,paquete ,{
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'accessToken': localStorage.getItem('accessToken')
    },
})
.then( (response) => { 
console.log(response)
});


}

function parseFecha(){

  let fechaParseada=(fechaCreacion.year).toString()+(fechaCreacion.month).toString()+(fechaCreacion.day).toString()

  setFechaParseada(fechaParseada);

}

function handleChange(e) {
  setMedidaElegida(e.target.value);
  setPaquete(paquete)
}



  return (
      
    <div className="contenido">

<form className='formulario' onSubmit={handleSubmit}>
<label htmlFor="medidas">Elige una medida:</label>
<select name="medidas" id="medidas" onChange={handleChange} required>
              <option key='Default' value="Todas">Todas</option>
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
      shouldHighlightWeekends/>

        <input type="submit" value="Submit" />
      </form>
      
    </div>
  );
}

export default InsertarNormal;
