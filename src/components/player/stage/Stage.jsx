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
                    <div className="seek_sign" id="forward">&gt;&gt; + 2 s &gt;&gt;</div>
                    <div className="seek_sign" id="backward">&lt;&lt; - 2 s &lt;&lt;</div>
                    <div className="seek_sign" id="pausing">- Pause -</div>
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
