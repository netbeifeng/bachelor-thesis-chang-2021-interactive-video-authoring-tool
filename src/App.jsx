import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import Player from './components/player/player';
import Progress from './components/progress/progress';
import Converter from './utilities/converter/Converter';

class App extends Component {
  constructor(props) {
    super(props);
    this.converter = new Converter();
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
    document.getElementsByClassName('main')[0].appendChild(this.converter.getContentNaviHTML());
  }
}


export default App;
