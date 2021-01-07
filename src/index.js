import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { HashRouter, Route } from 'react-router-dom';

import './index.css';
//import './App.css';
import Table from './components/Table';
import Chart from './components/Chart/chart';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter basename='/'>
    <div>  
        <main>
          <Route exact path="/" component={Table}/>
          <Route exact path="/chart" component={Chart} />
        </main>
  
        <footer>
          (c) 2021 Leopold Talirz
        </footer>
      </div>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

/* <header>
Atomistic Simulation Engines
</header> */

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
