import React, {useState,useEffect,useRef} from 'react';
import SelectMedidas from './FiltrosPaquetes';
import PopupExample from './modalExample';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker from 'react-modern-calendar-datepicker';
import axios from 'axios';
function InsertarNormal() {

  const [medidas, setMedidas] = useState([]);
  const [visible, setVisible] = useState();
  const [medidaElegida, setMedidaElegida] = useState('Todas');
  const [fechaCreacion, setFechaCreacion] = useState(null);

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



  return (
      
    <div className="contenido">
      <DatePicker
      value={fechaCreacion}
      onChange={setFechaCreacion}
      inputPlaceholder="Elige un día"
      shouldHighlightWeekends
    />
    </div>
  );
}

export default InsertarNormal;
