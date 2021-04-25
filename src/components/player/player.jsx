import React, { Component } from 'react';
// import PIXIStage from './pixi-stage/PIXIStage';
import HTMLStage from './HTML-stage/HTMLStage';

import ThreeStage from './three-stage/ThreeStage';
import Subtitle from '../subtitle/Subtitle';
import './player.scss';

class Player extends Component {
    render() {
        return (
            <div id='pixi-container' ref={this.myRef}>
                <HTMLStage />
                {/* <ThreeStage /> */}
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
