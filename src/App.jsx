import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Player from './components/player/player';
import Progress from './components/progress/progress';


class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

      <div className="main">
        <div id='head_container'>
          <h1>Interactive Learning Video Demo</h1>
        </div>
        <Player />
        <Progress />
      </div>
    );
  }

  componentDidMount() {
    console.log(
      `%c ILV %c v0.0.1 %c`,
      'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
      `background:#19be6b; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
      'background:transparent'
    );
  }
}


export default App;
