import React, {useState,useEffect,useRef} from 'react'
const axios = require('axios').default


function SelectClientes(props) {
    const [clientes, setClientes] = useState([])
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchClientes();
        return() => montadoRef.current = false;
    },[]);


const fetchClientes = async () => {
    await axios.get(`${process.env.REACT_APP_URL_API}/clientes`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'accessToken': localStorage.getItem('accessToken')
      },
    }).then(response => {
        const clientes = response.data;
        if(montadoRef.current)
        setClientes(clientes);
      });
    
};

function handleChange(e) {
    props.clienteMostrar(e.target.value);
  }

  return (
      <div>
          <label htmlFor="clientes">Elige una medida:</label>
          <select name="clientes" id="clientes" onChange={handleChange}>
              <option key='Default' value="Todos">Todos</option>
          {clientes.map(cliente => {
            return (
            <option key={cliente.cif} value={cliente.nombre}>{cliente.nombre}</option>
            ); 
})}
          </select>
      </div>

    
  );
}

export default SelectClientes;