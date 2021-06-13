import React, { Component } from 'react';

class InteractionLayer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='htmlInteractionLayer' style={{ zIndex: 1 }}>
                <div id='cursor' />
            </div>
        );
    }

    componentDidMount() {
        console.log('%c ---- PAINTING I-Layer ----', 'color: forestgreen;');
        this.paintElements();
        console.log('%c ---- I-Layer PREPARED ----', 'color: forestgreen;');

        console.log('%c ---- BUILDING TIMELINE ----', 'color: hotpink;');
        this.buildTimeline();
        console.log('%c ---- TIMELINE BUILT ----', 'color: hotpink;');
    }

    paintElements() {
        for (let slide of this.props.ILV.ILVObject.getSlides()) {
            for (let element of slide.getElements()) {
                element.paint();
            }
        }
    }

    buildTimeline() {
        this.props.ILV.ILVTimeline.gsapTimeline.addLabel("start", 0);
        for (let animation of this.props.ILV.ILVObject.getAnimations()) {
            animation.animate(this.props.ILV.ILVTimeline.gsapTimeline);
        }
        this.props.ILV.ILVTimeline.gsapTimeline.pause();
    }
}

export default InteractionLayer;
