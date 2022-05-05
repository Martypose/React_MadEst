import React from 'react';
import './assets/css/App.css';
import Nav from './components/Nav';
import VerMedidas from './components/VerMedidas';
import Transportistas from './components/Transportistas';
import Home from './components/Home'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import VerPaquetes from './components/VerPaquetes';
import Pedidos from './components/Pedidos';
import Login from './components/Login';
import axios from 'axios';
import {getRefreshToken} from './session/refreshToken';

axios.interceptors.response.use((response) => {
  return response;
  }, (error) => {
      console.log('ei')
      const originalRequest = error.config;
      if(error.response.status===301 && originalRequest._retry === false){
        originalRequest._retry = true;
      return axios.request(error.config);
      }
    if (error.response.status===402) {

      originalRequest._retry = true;
      console.log(localStorage.getItem('accessToken'))
      console.log(localStorage.getItem('username'))
      getRefreshToken(localStorage.getItem('refreshToken'),localStorage.getItem('username'));   
      console.log("dd")
      console.log(localStorage.getItem('username'));
      console.log(error.config)
      console.log("ss")
      return axios.request(error.config);
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
          <Route path="/transportistas" component={Transportistas} />
          <Route path="/paquetes" component={VerPaquetes} />
          <Route path="/pedidos" component={Pedidos} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
