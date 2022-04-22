import React from 'react';
import '../assets/css/App.css'
import { Link } from 'react-router-dom';
import swal from 'sweetalert';


function Nav() {

    function logOut(){
        swal("Success", "Adios "+localStorage.getItem('username'), "success", {
            buttons: false,
            timer: 2000,
          })
          .then((value) => {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("username")
                window.location.href = "/login";
    
          });


      }


  return (
    <nav>
        <Link to='/'>
            <h3>
                MadeirasEstanqueiro
            </h3>
        </Link>
        <ul className='nav-links'>
            <Link to='/Medidas'>
                <li>Medidas</li>
            </Link>
            <Link to='/Paquetes'>
                <li>Paquetes</li>
            </Link>
            <Link to='/Transportistas'>
                <li>Transportistas</li>
            </Link>
            <Link to='/Pedidos'>
                <li>Pedidos</li>
            </Link>

            <button onClick={() => { logOut() }}>Salir</button>

        </ul>
    </nav>
  );
}

export default Nav;
