import React from "react";
import { useInput } from '../hooks/inputHook';
function NuevaMedidaForm(props) {
    const { value:ID, bind:bindID, reset:resetID } = useInput('');
    const { value:Ancho, bind:bindAncho, reset:resetAncho } = useInput('');
    const { value:Grosor, bind:bindGrosor, reset:resetGrosor } = useInput('');
    const { value:Largo, bind:bindLargo, reset:resetLargo } = useInput('');
    const { value:EsMedible, bind:bindEsMedible, reset:resetEsMedible } = useInput('');
    const { value:Barroteado, bind:bindBarroteado, reset:resetBarroteado } = useInput('');
    const { value:Homogeneo, bind:bindHomogeneo, reset:resetHomogeneo } = useInput('');
    const { value:Calidad, bind:bindCalidad, reset:resetCalidad } = useInput('');
    const handleSubmit = (evt) => {
        evt.preventDefault();
        fetch("http://localhost:8080/medidas", {
  method: "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'auth-token': JSON.parse(localStorage.getItem('accessToken')).tokens
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
        resetEsMedible();
        resetBarroteado();
        resetHomogeneo();
        resetCalidad();
    }
    return (
      <form className='formulario' onSubmit={handleSubmit}>
        <label>
          ID:
          <input type="text" {...bindID} />
        </label>
        <label>
          Ancho:
          <input type="text" {...bindAncho} />
        </label>
        <label>
          Largo:
          <input type="text" {...bindLargo} />
        </label>
        <label>
          Grosor:
          <input type="text" {...bindGrosor} />
        </label>
        <label>
          EsMedible:
          <input type="checkbox" {...bindEsMedible} />
        </label>
        <label>
          Barroteado:
          <input type="checkbox" {...bindBarroteado} />
        </label>
        <label>
          Homogeneo:
          <input type="checkbox" {...bindHomogeneo} />
        </label>
        <label>
          Calidad:
          <input type="text" {...bindCalidad} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
  export default NuevaMedidaForm;