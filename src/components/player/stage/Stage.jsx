import React, { Component } from 'react';
import BackgroundLayer from './layers/BackgroundLayer';
import InteractionLayer from './layers/InteractionLayer';
import Subtitle from './subtitle/Subtitle';
import './Stage.scss';
// import '../../../assets/fontCSS/font.scss';

class Stage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='player-stage'>
                <div id='htmlStage'>
                    <Subtitle ILV={this.props.ILV} />
                    <InteractionLayer ILV={this.props.ILV} />
                    <BackgroundLayer ILV={this.props.ILV} />
                </div>
            </div>
        );
    }

    componentDidMount() {

    }
}

export default Stage;
