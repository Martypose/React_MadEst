import React from 'react';
import '../assets/css/App.css'
import { Link } from 'react-router-dom';

function Nav() {
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
        </ul>
    </nav>
  );
}

export default Nav;
