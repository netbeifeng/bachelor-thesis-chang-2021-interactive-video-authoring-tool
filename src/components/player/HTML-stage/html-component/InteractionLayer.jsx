import React, { Component, useRef } from 'react';
import Converter from '../../../../utilities/converter/Converter';

class InteractionLayer extends Component {

    constructor(props) {
        super(props);
        this.converter = new Converter()
    }

    render() {
        return (
            <div id='htmlInteractionLayer' style={{ zIndex: 1 }}>
                <h1 className='slideTitle' style={{ left: '90px', top: '85px' }}>Digitale Grauwertbilder</h1>
                {/* <object data="assests/video/video1.mp4" width = '300' height ='500'></object> */}
            </div>
        );
    }

    componentDidMount() {
        // console.log(this.converter.getILV().getCustomes());
        document.getElementById('htmlInteractionLayer').append(this.converter.getTextHTML(this.converter.getILV().getTexts()[0]));
        document.getElementById('htmlInteractionLayer').append(this.converter.getTextHTML(this.converter.getILV().getTexts()[1]));
        document.getElementById('htmlInteractionLayer').append(this.converter.getTextHTML(this.converter.getILV().getTexts()[2]));
        document.getElementById('htmlInteractionLayer').append(this.converter.getCustomHTML(this.converter.getILV().getCustomes()[0]));
        document.getElementById('htmlInteractionLayer').append(this.converter.getImageHTML(this.converter.getILV().getImages()[0]));
        document.getElementById('htmlInteractionLayer').append(this.converter.getImageHTML(this.converter.getILV().getImages()[1]));
        // console.log(this.converter.getILV().getVideos()[1]);
        // console.log(this.converter.getILV().getVideos()[0]);
        document.getElementById('htmlInteractionLayer').append(this.converter.getVideoHTML(this.converter.getILV().getVideos()[0]));
        // document.getElementById('htmlInteractionLayer').append(this.converter.getVideoHTML(this.converter.getILV().getVideos()[1]));
    }
}

export default InteractionLayer;
