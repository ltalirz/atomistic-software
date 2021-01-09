import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Route } from 'react-router-dom';

import './index.css';
//import './App.css';
import Table from './components/Table';
//import Home from './components/Home';
import Chart from './components/Chart/chart';
import SingleChart from './components/Chart/single';
import Typography from '@material-ui/core/Typography';

import Container from '@material-ui/core/Container';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter basename='/'>
    <Container maxWidth={'lg'} style={{'textAlign': 'center'}}>
        <main>
          <Route exact path="/" component={Table}/>
          <Route exact path="/chart" component={Chart} />
          <Route exact path="/charts/:code" component={SingleChart} />
         
        </main>
        <footer>
          <Typography>(c) 2021 Leopold Talirz</Typography>
        </footer>
      </Container>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
//  <Route exact path="/home" component={Home} /> 
/* <header>
Atomistic Simulation Engines
</header> */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
