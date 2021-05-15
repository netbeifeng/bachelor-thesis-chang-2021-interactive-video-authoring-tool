import React, { Component } from 'react';

import Stage from './stage/Stage';
import { Howl } from 'howler';
import { gsap } from 'gsap';
import Control from './control/Control';

import './Player.scss';
import Navigator from './navigator/Navigator';

class Player extends Component {
    constructor(props) {
        super(props);
        this.changeCaptionDisplayState = this.changeCaptionDisplayState.bind(this);
        this.timelineSeek = this.timelineSeek.bind(this);
        this.timelinePlay = this.timelinePlay.bind(this);
        this.timelinePause = this.timelinePause.bind(this);
        this.timelineRate = this.timelineRate.bind(this);
        this.howlerVolume = this.howlerVolume.bind(this);
        this.updatePlayerCurrentTiming = this.updatePlayerCurrentTiming.bind(this);

        this.state = {
            ILV: {
                ILVObject: this.props.ILVObject,
                ILVTimeline: {
                    howlerTimeline: new Howl({
                        src: [`assets/audio/${this.props.ILVObject.audio}`],
                        volume: 0.5
                    }),
                    gsapTimeline: gsap.timeline(),
                    timelineSeek: this.timelineSeek,
                    timelinePlay: this.timelinePlay,
                    timelinePause: this.timelinePause,
                    timelineRate: this.timelineRate,
                    howlerVolume: this.howlerVolume
                },
                ILVPlayer: {
                    playing: false,
                    duration: 0,
                    currentTiming: 0,
                    playSpeed: 1.0,
                    volume: 0.5,
                    muted: false,
                    caption: {
                        changeCaptionDisplayState: this.changeCaptionDisplayState,
                        captionDisplay: false
                    },
                    updatePlayerCurrentTiming: this.updatePlayerCurrentTiming
                }
            }
        }



    }


    render() {
        return (
            <div id='player-container'>
                <div id='player-stage'>
                    <Stage ILV={this.state.ILV} />
                </div>
                <div id='player-control'>
                    <Control ILV={this.state.ILV} />
                </div>
                <div id='player-navigator'>
                    <Navigator ILV={this.state.ILV} />
                </div>
            </div>
        );
    }

    updatePlayerCurrentTiming(currentTiming) {
        let ILV = this.state.ILV;
        ILV.ILVPlayer.currentTiming = currentTiming;
        this.setState({
            ILV: ILV
        });
    }

    initPlayer() {
        let _that = this;
        let ILV = this.state.ILV;
        this.state.ILV.ILVTimeline.howlerTimeline.on('load', function () {
            ILV.ILVPlayer.duration = this.duration();
            _that.setState({
                ILV: ILV
            });
        });
    }

    timelineSeek(seek, option) {
        if (option == 'gsap') {
            this.state.ILV.ILVTimeline.gsapTimeline.seek(Math.round(seek));
        } else {
            let ILV = this.state.ILV;
            ILV.ILVPlayer.currentTiming = seek;
            this.setState({
                ILV: ILV
            });
            this.state.ILV.ILVTimeline.gsapTimeline.seek(Math.round(seek));
            this.state.ILV.ILVTimeline.howlerTimeline.seek(Math.round(seek));
        }
    }

    timelinePlay() {
        let ILV = this.state.ILV;
        ILV.ILVPlayer.playing = true;
        this.setState({
            ILV: ILV
        });
        this.state.ILV.ILVTimeline.howlerTimeline.play();
        this.state.ILV.ILVTimeline.gsapTimeline.resume();
    }

    timelinePause() {
        let ILV = this.state.ILV;
        ILV.ILVPlayer.playing = false;
        this.setState({
            ILV: ILV
        });
        this.state.ILV.ILVTimeline.howlerTimeline.pause();
        this.state.ILV.ILVTimeline.gsapTimeline.pause();
    }

    timelineRate(rate) {
        let ILV = this.state.ILV;
        ILV.ILVPlayer.playSpeed = rate;
        this.setState({
            ILV: ILV
        });
        this.state.ILV.ILVTimeline.howlerTimeline.rate(rate);
        this.state.ILV.ILVTimeline.gsapTimeline.timeScale(rate);
    }

    howlerVolume(vol) {
        let ILV = this.state.ILV;
        ILV.ILVPlayer.volume = vol;
        if (vol <= 0) {
            ILV.ILVPlayer.muted = true;
        } else {
            ILV.ILVPlayer.muted = false;
        }
        this.setState({
            ILV: ILV
        });
        this.state.ILV.ILVTimeline.howlerTimeline.volume(vol);
    }

    componentDidMount() {
        this.initPlayer();
    }

    changeCaptionDisplayState = () => {
        let ILV = this.state.ILV;
        ILV.ILVPlayer.caption.captionDisplay = !ILV.ILVPlayer.caption.captionDisplay;
        this.setState({
            ILV: ILV
        });
    }

}

export default Player;
