import React from 'react';
import ReactDOM from 'react-dom';
import './utilities/reset.css';
import './index.scss';
import App from './App';
import HelmetHead from './components/helmet/helmet';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <div>
    <HelmetHead />
    {/* <React.StrictMode> */}
    <App />
    <div className={'signature'}>
      BA
    </div>
    {/* </React.StrictMode> */}
  </div>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
