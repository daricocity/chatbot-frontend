import './style.scss';
import App from './App';
import React from 'react';
import Router from './router';
import ReactDOM from 'react-dom';
import SocketService from './socketService';
// import reportWebVitals from './reportWebVitals';
import { StoreProvider } from './stateManagement/store';

ReactDOM.render(
    <StoreProvider>
      <Router />
      <SocketService />
    </StoreProvider>,
  document.getElementById('root')
);

// reportWebVitals();
