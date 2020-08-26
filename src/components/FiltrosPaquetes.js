import React, {useState,useEffect,useRef} from 'react';
import { Checkbox } from '../hooks/inputCheckBox';
function SelectMedidas(props) {
    const [checkEstados, setcheckEstados] = useState({});
    const [checkCalidades, setcheckCalidades] = useState({});
    const [medidas, setMedidas] = useState([]);
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchMedidas();
        return() => montadoRef.current = false;
    },[]);

    const handleChangeChecksEstados = (event) => {
        // updating an object instead of a Map
        let losOtros=[];

        checkboxesEstados.forEach(checkbox => {
            if(checkbox.name!==event.target.name){
                losOtros.push(checkbox.name);
            }

        });
        let uno = losOtros[0];
        let dos = losOtros[1];
        console.log(event.target.checked);
        props.estadoMostrar('Ninguno');
        if(event.target.checked===true){
            props.estadoMostrar(event.target.name);
        }
        setcheckEstados({...checkEstados, [event.target.name] : event.target.checked, [uno] : false, [dos] : false});

    }
    const handleChangeChecksCalidades = (event) => {
        // updating an object instead of a Map
        let losOtros=[];

        checkboxesCalidades.forEach(checkbox => {
            if(checkbox.name!==event.target.name){
                losOtros.push(checkbox.name);
            }

        });
        let uno = losOtros[0];
        let dos = losOtros[1];
        let tres = losOtros[2];
        console.log(event.target.checked);
        props.calidadMostrar('Ninguno');
        if(event.target.checked===true){
            props.calidadMostrar(event.target.name);
        }
        setcheckCalidades({...checkCalidades, [event.target.name] : event.target.checked, [uno] : false, [dos] : false, [tres] : false});

    }
    

    const checkboxesEstados = [
        {
            name: 'stock',
            key: 'stock',
            label: 'Stock',
        },
        {
            name: 'bajado',
            key: 'bajado',
            label: 'Bajados',
        },
        {
            name: 'vendido',
            key: 'vendido',
            label: 'Vendidos',
        }
    ];
    const checkboxesCalidades = [
        {
            name: 'Mala',
            key: 'Mala',
            label: 'Mala',
        },
        {
            name: 'Normal',
            key: 'Normal',
            label: 'Normal',
        },
        {
            name: 'Semilimpia',
            key: 'Semilimpia',
            label: 'Semilimpia',
        },
        {
            name: 'Limpia',
            key: 'Limpia',
            label: 'Limpia',
        }
    ];

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
      {
          checkboxesEstados.map(item => (
              <label key={item.key}>
                  <span> </span>  
                  {item.name}
                  <Checkbox name={item.name} checked={checkEstados[item.name]} onChange={handleChangeChecksEstados} />
              </label>
          ))
      }
      <hr></hr>
      {
          checkboxesCalidades.map(item => (
              <label key={item.key}>
                  <span> </span>  
                  {item.name}
                  <Checkbox name={item.name} checked={checkCalidades[item.name]} onChange={handleChangeChecksCalidades} />
              </label>
          ))
      }
      </div>

    
  );
}

export default SelectMedidas;
