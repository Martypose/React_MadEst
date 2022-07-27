import React, {useState,useEffect,useRef} from 'react';
import { useInput } from '../hooks/inputHook';

function NuevaMedidaForm(props) {
    const [calidades, setCalidades] = useState([]);
    const { value:ID, bind:bindID, reset:resetID } = useInput('');
    const { value:Ancho, bind:bindAncho, reset:resetAncho } = useInput('');
    const { value:Grosor, bind:bindGrosor, reset:resetGrosor } = useInput('');
    const { value:Largo, bind:bindLargo, reset:resetLargo } = useInput('');
    const [EsMedible, setEsMedible] = useState(false);
    const [Barroteado, setBarroteado] = useState(false);
    const [Homogeneo, setHomogeneo] = useState(false);
    const [Calidad, setCalidad] = useState([]);
    

    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchCalidades();
        return() => montadoRef.current = false;
    },[]);

    const handleSubmit = (evt) => {
        evt.preventDefault();
        fetch("https://localhost:8080/medidas", {
  method: "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'auth-token': JSON.parse(localStorage.getItem('accessToken')).token
  },
  //make sure to serialize your JSON body
  body: JSON.stringify({
    medida:{
      id:ID,
      ancho:Ancho,
      grosor:Grosor,
      largo:Largo,
      esMedible:EsMedible,
      barroteado:Barroteado,
      homogeneo:Homogeneo,
      calidad:Calidad
    }
  })
})
.then( (response) => { 
   console.log(response)
   props.fetch();
});
        resetID();
        resetAncho();
        resetGrosor();
        resetLargo();
        setEsMedible(false);
        setBarroteado(false);
        setHomogeneo(false);
        setCalidad('Normal')

    }
    const handleOnChangeEsMedible = () => {
      setEsMedible(!EsMedible);
    };
    const handleOnChangeBarroteado = () => {
      setBarroteado(!Barroteado);
    };
    const handleOnChangeHomogeneo = () => {
      setHomogeneo(!Homogeneo);
    };

    function handleChange(e) {
      setCalidad(e.target.value);
    }





    const fetchCalidades = async () => {
      const data = await fetch('https://localhost:8080/medidas/calidades',{
        method: "get",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth-token': JSON.parse(localStorage.getItem('accessToken')).token
        },
      });
      const calidades = await data.json();
      if(montadoRef.current)
      setCalidades(calidades);
      setCalidad('Normal');
    };


    return (
      <form className='formulario' onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="text" {...bindID} required/>
        </label>
        <label>
          Ancho:
          <input type="text" {...bindAncho} />
        </label>
        <label>
          Largo:
          <input type="text" {...bindLargo} required/>
        </label>
        <label>
          Grosor:
          <input type="text" {...bindGrosor} required/>
        </label>
        <label>
          EsMedible:
          <input
          type="checkbox"
          checked={EsMedible}
          onChange={handleOnChangeEsMedible}
        />
        </label>
        <label>
          Barroteado:
          <input
          type="checkbox"
          checked={Barroteado}
          onChange={handleOnChangeBarroteado}
        />
        </label>
        <label>
          Homogeneo:
          <input
          type="checkbox"
          checked={Homogeneo}
          onChange={handleOnChangeHomogeneo}
        />
        </label>
        <label htmlFor="calidad">Calidad:</label>
          <select name="calidad" id="calidad" onChange={handleChange} value={Calidad} required>
          {calidades.map(calidad => {
            return (
            <option key={calidad.calidad} value={calidad.calidad}>{calidad.calidad}</option>
            ); 
})}
          </select>
        <input type="submit" value="Submit" />
      </form>
    );
  }
  export default NuevaMedidaForm;