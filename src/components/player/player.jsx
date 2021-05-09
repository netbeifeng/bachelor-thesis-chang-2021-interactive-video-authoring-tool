import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import HTMLStage from './HTML-stage/HTMLStage';
import { Howl } from 'howler';
import { gsap } from 'gsap';
import Progress from '../progress/progress';
import Subtitle from './subtitle/Subtitle';
import ILVObject from '../../utilities/ILVObject';

import './player.scss';

class Player extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hgTimeline: {
                howlerTimeline: new Howl({
                    src: [`assets/audio/${ILVObject.audio}`],
                    volume: 0.5
                }),
                gsapTimeline: gsap.timeline(),
            },
            ILV: ILVObject
        }
    }


    render() {
        return (
            <div id='player-container' ref={this.myRef}>
                <div id='player-stage'>
                    <HTMLStage hgTimeline={this.state.hgTimeline} ILV={this.state.ILV} />
                    <Subtitle hgTimeline={this.state.hgTimeline} ILV={this.state.ILV} />
                </div>
                <div id='player-control'>
                    <Progress hgTimeline={this.state.hgTimeline} ILV={this.state.ILV} />
                </div>
                <div id='content_navigation'>
                    <strong>Contents</strong><br />
                    <div id='content-navi-items'>
                    </div>
                </div>
            </div>

        );
    }

    componentDidMount() {
        this.paintContentsNavigation();
    }

    paintContentsNavigation() {
        const secondFormatter = (sec) => {
            if (sec >= 60) {
                if (sec % 60 < 10) {
                    return `${(sec / 60).toFixed(0)}:0${(sec % 60)}`;
                }
                return `${(sec / 60).toFixed(0)}:${(sec % 60)}`;
            } else {
                return `0:${sec}`;
            }
        };
        const contents = this.state.ILV.getSlides().map((slide) =>
            <span key={slide.sid}>{slide.page}. 
                <span className="content_item" id={`NID_${slide.sid}`} data-start-time={slide.startTime} onClick={() => { this.timelineSeek(slide.startTime) }}>{slide.name}</span> 
                ({secondFormatter(slide.startTime)})<br />
            </span>
        );
        ReactDOM.render(contents, document.getElementById('content-navi-items'));
    }
}

export default Player;
