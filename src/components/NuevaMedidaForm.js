import React from "react";
import { useInput } from '../hooks/inputHook';
function NuevaMedidaForm(props) {
    const { value:ID, bind:bindID, reset:resetID } = useInput('');
    const { value:Ancho, bind:bindAncho, reset:resetAncho } = useInput('');
    const { value:Grosor, bind:bindGrosor, reset:resetGrosor } = useInput('');
    const { value:Largo, bind:bindLargo, reset:resetLargo } = useInput('');
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
      largo:Largo
      

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
          Grosor:
          <input type="text" {...bindGrosor} />
        </label>
        <label>
          Largo:
          <input type="text" {...bindLargo} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
  export default NuevaMedidaForm;