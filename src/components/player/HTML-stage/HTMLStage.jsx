import React, { Component, useRef } from 'react';
import BackgroundLayer from './html-component/BackgroundLayer';
import InteractionLayer from './html-component/InteractionLayer';
import './HTMLStage.scss';
import '../../../assests/fontCSS/font.scss';
class HTMLStage extends Component {

    constructor(props) {
        super(props);
        // let parser = new ILVParser();
        // console.log(parser);
    }

    render() {
        return (
            <div id='htmlStage'>
                <BackgroundLayer/>
                <InteractionLayer/>
            </div>
        );
    }

    componentDidMount() {

    }
}

export default HTMLStage;
