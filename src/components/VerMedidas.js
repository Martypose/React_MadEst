import React, {useState,useEffect,useRef} from 'react';
import NameForm from './NuevaMedidaForm';
import swal from 'sweetalert';
import axios from 'axios';


function Medidas() {

  const [medidas, setMedidas] = useState([]);

    const montadoRef = useRef(null);
    useEffect(() => {
        montadoRef.current = true;
        fetchMedidas();

        return() => montadoRef.current = false;
    },[]);


const [visible, setVisible] = useState();

const fetchMedidas = () => {
  console.log(localStorage.getItem('accessToken'))
  axios.get(`http://${process.env.REACT_APP_URL_API}/medidas`,{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'accessToken': localStorage.getItem('accessToken')
      },
    }).then(response => {
      const medidas = response.data;
      if(montadoRef.current)
      setMedidas(medidas);
    });
    



};



function nuevaMedida(){
  setVisible(visible ? false : true); 
  console.log(visible);
}


const  borrarMedida = async(id) =>{

  swal({
    title: "¿Seguro que quieres eliminar esta medida?",
    text: "Una vez eliminada no podrá ser recuperada",
    icon: "warning",
    buttons: true,
    dangerMode: true,
  })
  .then((willDelete) => {
    if (willDelete) {
      console.log('vamos a borrar medida')
      axios.delete(`http://${process.env.REACT_APP_URL_API}/medidas/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('accessToken')
        },
      })
      .then( (response) => { 
         console.log(response)
         fetchMedidas();
      });
  
      swal("Medida Eliminada", {
        icon: "success",
      });
    } else {
      swal("Medida no eliminada");   
    }
  });






  
 
}
  return (
    <div className="contenido">
      <h1>Medidas</h1>
      <button onClick={nuevaMedida}>
      Nueva Medida
    </button>
    <div className="contenedor">
      <div className="tabla">
        <table>
        <tbody>
        <tr>
          <th>ID</th>
          <th>Ancho</th>
          <th>Grosor</th>
          <th>Largo</th>
          <th>esMedible</th>
          <th>barroteado</th>
          <th>homogeneo</th>
          <th>calidad</th>
      </tr>
        
        {medidas.map(medida => {
            return (<tr key={medida.id}>
              <td>{medida.id}</td>
              <td>{medida.ancho}</td>
              <td>{medida.grosor}</td>
              <td>{medida.largo}</td>
              <td>{medida.esMedible}</td>
              <td>{medida.barroteado}</td>
              <td>{medida.homogeneo}</td>
              <td>{medida.calidad}</td>
              <td>
                <button onClick={() => { borrarMedida(medida.id) }}>Borrar</button>
            </td>
          </tr>); 
})}
          </tbody>
        </table>
        </div>
        <div className="form">
        {visible && <NameForm fetch={fetchMedidas} />}
      </div>
      </div>
    </div>
  );
}

export default Medidas;
