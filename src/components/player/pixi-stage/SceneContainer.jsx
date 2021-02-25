import React, { Component } from 'react';
import { Container } from '@inlet/react-pixi';
import Scene from './Scene';

class SceneContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scene: 0
        }
        this.scene_container = React.createRef("scene_container");
    }

    render() {
        return (
            <Container ref={this.scene_container}>
                <Scene scene={this.state.scene}/>
            </Container>
        )
    }

    componentDidMount() {
        let scene_container = this.scene_container.current;

    }
}

export default SceneContainer;