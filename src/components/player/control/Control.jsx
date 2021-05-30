import React, { Component } from 'react';
import './Control.scss';

import Buttons from './buttons/Buttons';
import Slider from './slider/Slider';

class Control extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='player-control'>
                <div id="control-container">
                    <div id="bottom-control">
                        <div id="button-container">
                            <Buttons ILV={this.props.ILV}></Buttons>
                        </div>
                        <div id="progress-container">
                            <Slider ILV={this.props.ILV} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Control;
