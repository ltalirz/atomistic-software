import React from 'react';
import ReactDOM from 'react-dom';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route } from 'react-router-dom';

import './index.css';
//import './App.css';
import Table from './components/Table';
import Chart from './components/Chart/chart';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <div>
        <header>
          Atomistic Simulation Engines
        </header>
  
        <main>
          <Route exact path="/" component={Table}/>
          <Route exact path="/chart" component={Chart} />
        </main>
  
        <footer>
          (c) 2020 Leopold Talirz
        </footer>
      </div>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
