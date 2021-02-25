import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Player from './components/player/player';
import Progress from './components/progress/progress';

class App extends Component {
  render() {
    return (

      <div className="main">
        <div id='head_container'>
          <h1>Interactive Learning Video Demo</h1>
        </div>
        <Player />
        <Progress />
      </div>

      // <div className="App">
      //   <header className="App-header">
      //     <img src={logo} className="App-logo" alt="logo" />
      //     <p>
      //       Edit <code>src/2224.js</code> and222 save to reload.
      //     </p>
      //     <a
      //       className="App-link"
      //       href="https://reactjs.org"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     >
      //       Lear2222 n React
      //     </a>
      //   </header>
      // </div>
    );
  }
}


export default App;
