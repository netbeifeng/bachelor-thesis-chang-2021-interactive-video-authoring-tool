import React, { Component } from 'react';

import PlayButton from './PlayButton';
import SubtitleButton from './SubtitleButton';
import VolumeButton from './VolumeButton';
import PlaySpeedButton from './PlaySpeedButton';
class Buttons extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <PlayButton ILV={this.props.ILV} />
                <PlaySpeedButton ILV={this.props.ILV} />
                <SubtitleButton ILV={this.props.ILV} />
                <VolumeButton ILV={this.props.ILV} />
            </div>
        );
    }
}

export default Buttons;