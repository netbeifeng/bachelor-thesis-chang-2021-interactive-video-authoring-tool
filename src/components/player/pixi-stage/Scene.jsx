import React, { Component, useRef } from 'react';
import { Container, Stage, Text, Graphics, useApp } from '@inlet/react-pixi';
import RoundedRect from './RoundedRect';
import GrayMatrixCell from './GrayMatrixCell';
import { Sprite, AnimatedSprite } from '@inlet/react-pixi';
import logo from '../../../assests/public_imgs/logo.png';
import sub_logo from '../../../assests/public_imgs/sub_logo.png';

import * as PIXI from 'pixi.js';

import scene_1 from '../../../assests/demo_1/powerpoint_1.png';
import scene_2 from '../../../assests/demo_2/powerpoint_2.png';

import reset from '../../../assests/public_imgs/reset.png';
import back from '../../../assests/public_imgs/back.png';
import ee from '../../../utilities/event-emitter';
import RGBColor from '../../../enities/Color/RGBColor';
import GrayColor from '../../../enities/Color/GrayColor';
import AnimationFactory from '../../../enities/Animation/AnimationFactory';
import GlobalVar from '../../../utilities/GlobalVar';

import pixi_loading_map from '../../../assests/public_imgs/pixi-loading/map.json';
import Circle from './Circle';

class Scene extends Component {
    sceneList = [scene_1, scene_2];
    pixi_loading = [];
    constructor(props) {
        super(props);
        this.container = React.createRef("container");
        // PIXI.Texture.from('imgs/pixi-loading/frame_11.png');
        for (let item of pixi_loading_map) {
            this.pixi_loading.push(PIXI.Texture.from(`imgs/pixi-loading/${item.name}`));
        }

        this.grayMatrixArray = [];
        for (let i = 0; i < 5; i++) {
            for (let j = 0; j < 4; j++) {
                let hex = 0;
                let color = undefined;
                if (i == 2 && j == 2) {
                    color = new GrayColor(144);
                    hex = color.getHex();
                } else if (i == 3 && j == 1) {
                    color = new GrayColor(233);
                    hex = color.getHex();
                } else if (i == 3 && j == 3) {
                    color = new GrayColor(0);
                    hex = color.getHex();
                } else {
                    color = new RGBColor().getGrayColor();
                    hex = color.getHex();
                }
                GlobalVar.grayMatrix.push({
                    row: j,
                    col: i,
                    color: color
                });
                this.grayMatrixArray.push(
                    <GrayMatrixCell type={1} row={j + 1} col={i + 1} color={color} key={`square_${i}_${j}`} x={150 + 100 * i} y={300 + 100 * j} width={100} height={100} round={0} fill={hex} lineWidth={2} lineColor={0x000000} lineAplha={1} interactive={true}>
                    </GrayMatrixCell>
                )
                this.grayMatrixArray.push(
                    <GrayMatrixCell type={2} row={j + 1} col={i + 1} key={`square_value_${i}_${j}`} x={800 + 100 * i} y={300 + 100 * j} width={100} height={100} round={0} fill={0xffffff} lineWidth={2} lineColor={0x000000} lineAplha={1}>
                        <Text x={10} y={10} text={color.getGray()} style={{ fontFamily: 'UnitMedium', fontSize: 26, fill: 0x0 }} />
                    </GrayMatrixCell>
                );
            }
        }
        this.ee = ee;
        this.state = {
            scene: props.scene
        }

    }

    render() {
        switch (this.state.scene) {
            case -1: {
                return (
                    <Container>
                        <AnimatedSprite
                            anchor={0.5}
                            textures={this.pixi_loading}
                            isPlaying={true}
                            initialFrame={0}
                            animationSpeed={0.6}
                            position={[960, 470]}
                        />
                        <Text position={[895, 535]} text={"Loading..."} style={{ fontFamily: 'UnitMedium', fontSize: 36, fill: 0xdc3c05 }} />
                    </Container>
                )
            }
            case 0: {
                return (
                    <Container>
                        <RoundedRect scene={1} type={0} x={100} y={260} width={465} height={120} round={20} fill={0xdc3c05} lineWidth={2} lineColor={0xffffff} lineAplha={1} interactive={true}>
                            <Text x={55} y={40} text="Digitale Grauwertbilder" style={{ fontFamily: 'UnitMedium', fontSize: 36, fill: 0x0 }} />
                        </RoundedRect>
                        <RoundedRect scene={2} type={0} x={100} y={460} width={465} height={120} round={20} fill={0xdc3c05} lineWidth={2} lineColor={0xffffff} lineAplha={1} interactive={true}>
                            <Text x={55} y={40} text="Konve" style={{ fontFamily: 'UnitMedium', fontSize: 36, fill: 0x0 }} />
                        </RoundedRect>
                        <RoundedRect scene={3} type={0} x={100} y={660} width={465} height={120} round={20} fill={0xdc3c05} lineWidth={2} lineColor={0xffffff} lineAplha={1} interactive={true}>
                            <Text x={55} y={40} text="Lorem ipsum dolor 2" style={{ fontFamily: 'UnitMedium', fontSize: 36, fill: 0x0 }} />
                        </RoundedRect>
                        <Sprite image={logo} x={1593} y={416} width={250} height={594} />
                        <Sprite image={sub_logo} x={1585} y={155} width={210} height={272} />
                        <Text x={60} y={60} text="Willkommen zur Demo vom Interaktiven Lernvideo." style={{ fontFamily: 'UnitMedium', fontSize: 40, fill: 0x0 }} />
                        <Text x={60} y={120} text="Sie können eine Demo Ausschnitt wählen." style={{ fontFamily: 'UnitMedium', fontSize: 56, fill: 0x0 }} />
                        <Text x={60} y={900} text="Quelle:" style={{ fontFamily: 'UnitMedium', fontSize: 36, fill: 0x0 }} />
                        <Text x={70} y={950} text="- [CG1] Einfache Objekte - Prof. Ginkel" style={{ fontFamily: 'UnitLight', fontSize: 26, fill: 0x0 }} />
                        <Text x={70} y={990} text="- [CG2] Bildrepräsentation und PunktoperationenDatei - Prof. Ginkel" style={{ fontFamily: 'UnitLight', fontSize: 26, fill: 0x0 }} />
                    </Container>
                );
            }

            case 1: {

                return (
                    <Container>
                        <Sprite image={this.sceneList[this.state.scene - 1]} x={0} y={0} width={1920} height={1080} />
                        <Sprite image={back} position={[1800, 50]} width={40} height={40} interactive={true} buttonMode={true} pointerdown={() => {
                            this.ee.emit('scene_change', { scene: 0, proactiveBack: true })
                        }} />
                        <Container ref={this.container}>
                            <Text x={90} y={260} text={"2D-Array:"} style={{ fontFamily: 'UnitMedium', fontSize: 26, fill: 0xdc3c05 }} />
                            <Sprite x={780} y={265} width={30} height={30} image={reset} interactive={true} buttonMode={true} pointerdown={() => {
                                let getArrayElementByRowCol = (arr, row, col) => {
                                    for (let item of arr) {
                                        if (item.col == col && item.row == row) {
                                            return item;
                                        }
                                    }
                                }

                                for (let child of this.container.current.children) {
                                    if (child.type == 1 && !child.bin) {
                                        let item = getArrayElementByRowCol(GlobalVar.grayMatrix, child.row - 1, child.col - 1);
                                        child.clear();
                                        child.color.hex = item.color.hex;
                                        child.color.gray = item.color.gray;
                                        child.lineStyle(2, 0x0)
                                            .beginFill(item.color.hex)
                                            .drawRect(0, 0, 100, 100)
                                            .endFill();
                                        child.position.set(child.x, child.y);

                                        for (let _child of this.container.current.children) {
                                            if (_child.type == 2) {
                                                if (child.row == _child.row && child.col == _child.col) {
                                                    _child.children[0].text = item.color.gray;
                                                }
                                            }
                                        }
                                    }
                                }
                            }} />

                            {this.grayMatrixArray}

                            <Circle x={1400} y={380} circleType={1} fill={0x0} radius={60} lineWidth={1} lineColor={0xaaaaaa} lineAplha={1} interactive={true}>
                                <Text x={1370} y={365} text={"Binär"} style={{ fontFamily: 'UnitMedium', fontSize: 26, fill: 0xffffff }} />
                            </Circle>
                            <Circle x={1400} y={540} circleType={2} fill={0x888888} radius={60} lineWidth={1} lineColor={0xaaaaaa} lineAplha={1} interactive={true}>
                                <Text x={1375} y={525} text={"Grau"} style={{ fontFamily: 'UnitMedium', fontSize: 26, fill: 0xffffff }} />
                            </Circle>

                        </Container>
                    </Container >
                );
            }

            case 2: {
                return (
                <Container>
                    <Container ref={this.container}>
                    <Sprite image={this.sceneList[this.state.scene - 1]} x={0} y={0} width={1920} height={1080} />
                        <Sprite image={back} position={[1800, 50]} width={40} height={40} interactive={true} buttonMode={true} pointerdown={() => {
                            this.ee.emit('scene_change', { scene: 0, proactiveBack: true })
                        }} />
                    </Container>
                </Container>);
            }

            default: {
                return (<>
                </>);
            }
        }

    }

    componentDidMount() {

        ee.on('howler_pause', () => {
            this.timeline.pause();
        });

        ee.on('howler_replay', () => {
            this.timeline.resume();
        });

        ee.on('howler_seek', (e) => {
            let seek = Math.round(e.seek);
            this.timeline.seek(seek);
        });

        ee.on('scene_change', (e) => {
            if(e.proactiveBack) {
                this.container.current.parent.removeChildren();
                this.timeline.kill();
                ee.emit('stage_init', {});
            }

            this.setState({
                scene: e.scene
            })
        })

        ee.on('scene_change_var', (e) => {
            this.setState({
                scene: e.scene
            })
            if (e.scene == 1) {
                GlobalVar.demo1_container = this.container.current;
            }
            this.animationFactory = new AnimationFactory(e.scene, this.container.current);
            this.timeline = this.animationFactory.getTimeline();
            e.howler.play();
            ee.emit("howler_play", { track: e.scene });
        })
    }

}

export default Scene;