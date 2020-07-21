import React from "react";
import { useInput } from '../hooks/inputHook';
function NuevaMedidaForm(props) {
    const { value:ID, bind:bindID, reset:resetID } = useInput('');
    const { value:Ancho, bind:bindAncho, reset:resetAncho } = useInput('');
    const { value:Grosor, bind:bindGrosor, reset:resetGrosor } = useInput('');
    const { value:Largo, bind:bindLargo, reset:resetLargo } = useInput('');
    const handleSubmit = (evt) => {
        evt.preventDefault();
        alert(`Enviado ${ID} ${Ancho} ${Grosor} ${Largo}`);
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