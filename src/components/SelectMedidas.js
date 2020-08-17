import React, {useState,useEffect,useRef} from 'react';
function SelectMedidas(props) {
  const [medidas, setMedidas] = useState([]);
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchMedidas();
        return() => montadoRef.current = false;
    },[]);

const fetchMedidas = async () => {
    const data = await fetch('http://www.maderaexteriores.com/medidas');
    const medidas = await data.json();
    if(montadoRef.current)
    setMedidas(medidas);
};

function handleChange(e) {
    props.medidaMostrar(e.target.value);
  }

  return (
      <div>
          <label htmlFor="medidas">Elige una medida:</label>
          <select name="medidas" id="medidas" onChange={handleChange}>
              <option key='Default' value="Todas">Todas</option>
          {medidas.map(medida => {
            return (
            <option key={medida.id} value={medida.id}>{medida.id}</option>
            ); 
})}
          </select>
      </div>
    
  );
}

export default SelectMedidas;
