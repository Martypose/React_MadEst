import React from 'react';
import './assets/css/App.css';
import Nav from './components/Nav';
import VerMedidas from './components/VerMedidas';
import VerClientes from './components/VerClientes';
import InsertarPaqueteNormal from './components/InsertarPaqueteNormal';
import InsertarPaqueteMedido from './components/InsertarPaqueteMedido';
import InsertarCliente from './components/InsertarCliente';
import Transportistas from './components/Transportistas';
import DetallesPaquete from './components/DetallesPaquete';
import DetallesCliente from './components/DetallesCliente';
import AnalisisProduccion from './components/AnalisisProduccion';
import DetallesPrecioMadera from './components/DetallesPrecioMadera';
import Estadisticas from './components/Estadisticas';
import VerPreciosMadera from './components/VerPreciosMadera';
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import VerPaquetes from './components/VerPaquetes';
import Pedidos from './components/Pedidos';
import Login from './components/Login';
import axios from 'axios';
axios.defaults.baseURL = process.env.REACT_APP_URL_API;

axios.interceptors.response.use((response) => {
  return response;
  }, (error) => {
      console.log('Error en llamada, comprobando cual es...')
      console.log(error.response)
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
          <Route path='/estadisticas' exact component={Estadisticas} />
          <Route path="/medidas" component={VerMedidas} />
          <Route path="/insertarnormal" component={InsertarPaqueteNormal} />
          <Route path="/insertarmedido" component={InsertarPaqueteMedido} />
          <Route path="/clientes" component={VerClientes} />
          <Route path="/insertarcliente" component={InsertarCliente} />
          <Route path="/transportistas" component={Transportistas} />
          <Route path="/paquetes" component={VerPaquetes} />
          <Route path="/pedidos" component={Pedidos} />
          <Route path='/detallespaquete' component={DetallesPaquete} />
          <Route path='/detallescliente' component={DetallesCliente} />
          <Route path='/detallespreciomadera' component={DetallesPrecioMadera} />
          <Route path='/preciosmadera' component={VerPreciosMadera} />
          <Route path='/analisisproduccion' component={AnalisisProduccion} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
