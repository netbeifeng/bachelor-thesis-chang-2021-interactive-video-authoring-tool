import React, { Component, useRef } from 'react';
import Draggable from 'react-draggable';
import ThreePlayer from './ThreePlayer';
import ThreeContainerControl from './ThreeContainerControl';

class ThreeStage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Draggable
                handle="#three-window-handle"
                defaultPosition={{ x: 0, y: 0 }}
                bounds={{ top: -330, left: -850, right: 0, bottom: 0 }}
                scale={1}
                // onDrag={this.containerDrag}
            >
                <div id="three-container">
                    <ThreePlayer />
                    <ThreeContainerControl />
                </div>
            </Draggable>

        );
    }

    componentDidMount() {

    }
}

export default ThreeStage;
