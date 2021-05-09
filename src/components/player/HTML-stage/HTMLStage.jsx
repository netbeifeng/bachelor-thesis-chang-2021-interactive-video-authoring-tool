import React, { Component } from 'react';
import BackgroundLayer from './html-component/BackgroundLayer';
import InteractionLayer from './html-component/InteractionLayer';
import './HTMLStage.scss';
import '../../../assets/fontCSS/font.scss';

class HTMLStage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='htmlStage'>
                <BackgroundLayer hgTimeline={this.props.hgTimeline} ILV={this.props.ILV} />
                <InteractionLayer hgTimeline={this.props.hgTimeline} ILV={this.props.ILV} />
            </div>
        );
    }

    componentDidMount() {

    }
}

export default HTMLStage;
