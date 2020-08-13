import React, {useState,useEffect,useRef} from 'react';
function Conductores(props) {
    const [conductores, setConductores] = useState([]);
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchConductores();

        return() => montadoRef.current = false;
    },[]);

const fetchConductores = async () => {
    const data = await fetch('http://www.maderaexteriores.com/transporte/conductor',{
      method: 'GET',
      headers:{
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }});
    const conductores = await data.json();
    if(montadoRef.current)
    setConductores(conductores);

};

  return (
          <div className="tabla">
        <table>
        <tbody>
        <tr>
          <th>DNI</th>
          <th>Nombre</th>
          <th>Firma</th>
      </tr>
        
        {conductores.map(conductor => {
            console.log(conductor.transportista);
            if(conductor.transportista === props.transportista){
                let imagen = 'http://www.maderaexteriores.com/images/'+ conductor.firma;
                return (<tr key={conductor.DNI}>
                    <td>{conductor.DNI}</td>
                  <td>{conductor.nombre}</td>
                  <td><img src={imagen} alt="firma del conductor"/></td>
                  </tr>); 

            }else {
                return null;
            }
})}
          </tbody>
        </table>
        </div>   
    );
  }
  export default Conductores;