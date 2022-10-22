import React from 'react';
import './assets/css/App.css';
import Nav from './components/Nav';
import VerMedidas from './components/VerMedidas';
import InsertarNormal from './components/InsertarNormal';
import InsertarMedido from './components/InsertarMedido';
import InsertarCliente from './components/InsertarCliente';
import Transportistas from './components/Transportistas';
import DetallesPaquete from './components/DetallesPaquete';
import Home from './components/Home'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import VerPaquetes from './components/VerPaquetes';
import Pedidos from './components/Pedidos';
import Login from './components/Login';
import axios from 'axios';

axios.interceptors.response.use((response) => {
  return response;
  }, (error) => {
      console.log('Error en llamada, comprobando cual es...')
      const originalRequest = error.config;
      if(error.response.status===301 && !originalRequest._retry){
        originalRequest._retry = true;
      return axios.request(error.config);
      }
    if (error.response.status===402 && !originalRequest._retry) {
      originalRequest._retry = true;
      return axios.get(`${process.env.REACT_APP_URL_API}/refreshtoken`, {
        headers: {
          'Content-Type': 'application/json',
          'refreshToken': localStorage.getItem('refreshToken'),
          'username': localStorage.getItem('username')
        }
      }).then(response => {
          console.log('pidiendo accesToken con refresh')
  
          console.log(response)
          if ('accessToken' in response.data) {
            console.log('me sirven los tokens')
            localStorage.setItem('accessToken', response.data['accessToken'].accessToken);
            console.log("nuevo tokenaccess: "+response.data['accessToken'].accessToken)
            localStorage.setItem('refreshToken', response.data['refreshToken'].refreshToken);
            console.log("nuevo refresh: "+response.data['refreshToken'].refreshToken)
            localStorage.setItem('username', response.data['username']);
            error.config.headers.accessToken = localStorage.getItem('accessToken');
            return axios.request(error.config);
            } else {
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('username');
          }
  
      }).catch(error => {
        console.log(error)
  
      })
     

   
      
    }
    return Promise.reject(error);
  });


function App() { 

  const token = localStorage.getItem('accessToken');

  if(!token) {
    return <Login />
  }
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path="/medidas" component={VerMedidas} />
          <Route path="/insertarnormal" component={InsertarNormal} />
          <Route path="/insertarmedido" component={InsertarMedido} />
          <Route path="/insertarcliente" component={InsertarCliente} />
          <Route path="/transportistas" component={Transportistas} />
          <Route path="/paquetes" component={VerPaquetes} />
          <Route path="/pedidos" component={Pedidos} />
          <Route path='/detallespaquete' component={DetallesPaquete} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
