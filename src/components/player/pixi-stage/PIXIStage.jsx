import React, { Component, useRef } from 'react';
import { Stage, Text, useApp } from '@inlet/react-pixi';
import SceneContainer from './SceneContainer';

class PIXIStage extends Component {
    render() {
        return (
            <Stage width={1920} height={1080} options={ {backgroundColor: 0xffffff} }>
                <SceneContainer />
            </Stage>
        );
    }

    constructor(props) {
        super(props);
        
    }

    componentDidMount() {
        // this.initScene(useApp().stage);
    }
}

export default PIXIStage;
