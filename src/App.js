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
