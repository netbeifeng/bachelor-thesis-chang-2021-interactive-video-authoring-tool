import { Graphics } from 'pixi.js';
import { PixiComponent } from '@inlet/react-pixi';

import * as PIXI from 'pixi.js';
import ee from '../../../utilities/event-emitter';
import Slider from '../../../utilities/iwm/Slider';
import GrayColor from '../../../enities/Color/GrayColor';

export default PixiComponent('GrayMatrixCell', {
    create: props => {
        return new Graphics()
    },
    didMount: (instance, parent) => {
        // apply custom logic on mount
    },
    willUnmount: (instance, parent) => {
        // clean up before removal
    },
    applyProps: (instance, oldProps, newProps) => {
        const { type, fill, x, y, col, row, width, height, round, lineColor, lineWidth, lineAlpha, interactive } = newProps
        instance.clear()
        instance.lineStyle(lineWidth, lineColor, lineAlpha)
        instance.beginFill(fill)
        instance.drawRoundedRect(0, 0, width, height, round)
        instance.endFill();
        instance.position.set(x, y);

        instance.col = col;
        instance.row = row;
        instance.type = type;

        if (interactive) {
            instance.interactive = true;
            instance.buttonMode = true;
            if (instance.type == 1) {
                let getCellByRowCol = (_parent, _row, _col) => {
                    for (let _child of _parent.children) {
                        if (_row == _child.row && _col == _child.col && _child.type == 2) {
                            return _child;
                        }
                    }
                }

                let createSlider = (parent) => {
                    let sub_container = new PIXI.Container();
                    let roundedRectangle = new PIXI.Graphics();
                    roundedRectangle.lineStyle(0, 0xffffff, 1);
                    roundedRectangle.beginFill(0xd3d3d3);
                    roundedRectangle.drawRoundedRect(95, 730, 800, 60, 30);
                    roundedRectangle.endFill();
                    sub_container.addChild(roundedRectangle);
                    let whiteCircle = new PIXI.Graphics();
                    whiteCircle.lineStyle(0, 0xffffff, 1);
                    whiteCircle.beginFill(0xffffff);
                    whiteCircle.drawCircle(865, 760, 26);
                    whiteCircle.endFill();
                    sub_container.addChild(whiteCircle);
                    let blackCircle = new PIXI.Graphics();
                    blackCircle.lineStyle(0, 0x0, 1);
                    blackCircle.beginFill(0x000000);
                    blackCircle.drawCircle(125, 760, 26);
                    blackCircle.endFill();
                    sub_container.addChild(blackCircle);
                    let blackText = new PIXI.Text('0', { fontFamily: 'UnitMedium', fontSize: 20, fill: 0xffffff })
                    blackText.x = 117;
                    blackText.y = 748;
                    sub_container.addChild(blackText);

                    let whiteText = new PIXI.Text('255', { fontFamily: 'UnitMedium', fontSize: 20, fill: 0x0 })
                    whiteText.x = 847;
                    whiteText.y = 748;
                    sub_container.addChild(whiteText);

                    let slider = new Slider({
                        x: 150,
                        y: 730,
                        value: instance.color.gray,
                        width: 600,
                        height: 30,
                        fill: 0x808080,
                        stroke: 0x0,
                        strokeWidth: 2,
                        controlStroke: 0xbebebe,
                        controlStrokeWidth: 4,
                        controlRadius: 30,
                        min: 0,
                        max: 255,
                        tooltip: 'Range: 0 - 255',
                        onUpdate: (event, slider) => {
                            slider.tooltip.content = slider.value;
                            instance.color = new GrayColor(slider.value);

                            instance.clear();
                            instance.beginFill(instance.color.hex, 1)
                                .lineStyle(lineWidth, 0x0, lineAlpha)
                                .drawRoundedRect(0, 0, width, height, round)
                                .endFill();
                            instance.position.set(x, y);
                            let value_instance = getCellByRowCol(instance.parent, instance.row, instance.col);
                            value_instance.children[0].text = slider.value;
                        }
                    });
                    sub_container.addChild(slider);
                    parent.addChild(sub_container);
                    parent.slider = sub_container;
                }
                instance.color = newProps.color;

                instance.pointerdown = () => {
                    if (instance.bin) {

                    } else {
                        let parent = instance.parent;
                        // console.log(parent);
                        let child = parent.currentSelected;
                        if (child) {
                            child.clear();
                            child.beginFill(instance.color.hex, 1)
                                .lineStyle(lineWidth, 0x0, lineAlpha)
                                .drawRoundedRect(0, 0, width, height, round)
                                .endFill();
                            child.position.set(x, y);

                            let value_instance = getCellByRowCol(parent, child.row, child.col);
                            parent.setChildIndex(parent.currentSelected, parent.children.length - 2);
                            value_instance.children[0].style.fill = 0x0;
                            child.parent.removeChild(child.parent.slider);
                        }

                        instance.clear();
                        instance.beginFill(instance.color.hex, 1)
                            .lineStyle(lineWidth + 2, 0xb22222, lineAlpha)
                            .drawRoundedRect(0, 0, width, height, round)
                            .endFill();
                        instance.position.set(x, y);

                        let value_instance = getCellByRowCol(parent, instance.row, instance.col);
                        value_instance.children[0].style.fill = 0xb22222;
                        parent.currentSelected = instance;

                        createSlider(parent);
                    }

                }

                instance.pointerover = () => {
                    let parent = instance.parent;
                    if (parent.currentSelected == instance || instance.bin) {
                        //
                    } else {
                        parent.setChildIndex(instance, parent.children.length - 3);
                        instance.clear();
                        instance.beginFill(instance.color.hex, 1)
                            .lineStyle(lineWidth + 1, 0xff8c00, lineAlpha)
                            .drawRoundedRect(0, 0, width, height, round)
                            .endFill();
                        instance.position.set(x, y);

                        let value_instance = getCellByRowCol(parent, instance.row, instance.col);
                        value_instance.children[0].style.fill = 0xff8c00;
                    }
                }

                instance.pointerout = () => {
                    let parent = instance.parent;
                    if (parent.currentSelected == instance || instance.bin) {

                    } else {
                        instance.clear();
                        instance.beginFill(instance.color.hex, 1)
                            .lineStyle(lineWidth, 0x0, lineAlpha)
                            .drawRoundedRect(0, 0, width, height, round)
                            .endFill();
                        instance.position.set(x, y);

                        let value_instance = getCellByRowCol(parent, instance.row, instance.col);
                        value_instance.children[0].style.fill = 0x0;
                    }
                }
            }
        }
    },
})
