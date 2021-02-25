import React, { Component } from 'react';
import Subtitle from '../subtitle/subtitle';
import PIXIStage from './pixi-stage/PIXIStage';
import './player.scss';

class Player extends Component {
    render() {
        return (
            <div id='pixi-container' ref={this.myRef}>
                <PIXIStage />
                <Subtitle />
            </div>
        );
    }

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
    }

    componentDidMount() {

    }

}

export default Player;
