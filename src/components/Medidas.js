import React, {useState,useEffect,useRef} from 'react';

function Medidas() {
    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchMedidas();

        return() => montadoRef.current = false;
    });

const [medidas, setMedidas] = useState([]);

const fetchMedidas = async () => {
    const data = await fetch('http://www.maderaexteriores.com/medidas');
    const medidas = await data.json();
    if(montadoRef.current)
    setMedidas(medidas);

};



  return (
    <div>
      <h1>Medidas</h1>
      <table>
      <tbody>
      <tr>
        <th>ID</th>
        <th>Ancho</th>
        <th>Grosor</th>
        <th>Largo</th>
    </tr>
      
      {medidas.map(medida => (
        <tr key={medida.id}>
            <td>{medida.id}</td>
            <td>{medida.ancho}</td>
            <td>{medida.grosor}</td>
            <td>{medida.largo}</td>
        </tr>
            ))}
        
        </tbody>
      </table>
        

    </div>
  );
}

export default Medidas;
