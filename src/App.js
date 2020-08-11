import React from 'react';
import './assets/css/App.css';
import Nav from './components/Nav';
import Medidas from './components/Medidas';
import Transportistas from './components/Transportistas';
import Home from './components/Home'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';

function App() { 
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path="/medidas" component={Medidas} />
          <Route path="/transportistas" component={Transportistas} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
