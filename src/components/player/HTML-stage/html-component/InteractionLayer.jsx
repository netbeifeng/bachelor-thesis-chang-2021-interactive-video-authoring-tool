import React, { Component, useRef } from 'react';

class InteractionLayer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='htmlInteractionLayer' style={{ zIndex: 1 }}>
                <div id='cursor'/>
            </div>
        );
    }

    componentDidMount() {
    }

    
}

export default InteractionLayer;
