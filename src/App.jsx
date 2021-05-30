import React, { Component } from 'react';
import './App.scss';
import Player from './components/player/Player';
import Head from './components/head/Head';
import ILVGenerator from './utilities/ILVGenerator';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ILVObject: new ILVGenerator().getILV()
    }
  }
  render() {
    return (
      <div>
        <Head ILVObject={this.state.ILVObject} />
        <Player ILVObject={this.state.ILVObject} />
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
