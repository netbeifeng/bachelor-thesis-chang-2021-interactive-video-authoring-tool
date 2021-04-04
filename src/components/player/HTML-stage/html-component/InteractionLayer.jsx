import React, { Component, useRef } from 'react';
import Converter from '../../../../utilities/converter/Converter';

class InteractionLayer extends Component {

    constructor(props) {
        super(props);
        this.converter = new Converter()
    }

    render() {
        return (
            <div id='htmlInteractionLayer' style={{zIndex: 1}}>
                <h1 className='slideTitle' style={{left: '90px', top: '85px'}}>Digitale Grauwertbilder</h1>
            </div>
        );
    }

    componentDidMount() {
        // console.log(this.converter.getILV().getCustomes());
        document.getElementById('htmlInteractionLayer').appendChild(this.converter.getTextHTML(this.converter.getILV().getTexts()[0]));
        document.getElementById('htmlInteractionLayer').appendChild(this.converter.getCustomHTML(this.converter.getILV().getCustomes()[0]));
        document.getElementById('htmlInteractionLayer').appendChild(this.converter.getImageHTML(this.converter.getILV().getImages()[0]));
        document.getElementById('htmlInteractionLayer').appendChild(this.converter.getImageHTML(this.converter.getILV().getImages()[1]));
    }
}

export default InteractionLayer;
