import React, { Component, createRef, useRef } from 'react';


class PlaySwitch extends Component {

    state = {
        playing: false,
        style: { backgroundColor: "rgba(46, 46, 46, 0.8)", cursor: "not-allowed" },
        className: "fas fa-ban",
        text: "Load"
    }

    constructor(props) {
        super(props);
    }

    render() {
        // let button = this.renderButton();
        return (
            <div id="player_switch" style={this.state.style} onClick={this.handleClick.bind(this)}>
                <i id='play' className={this.state.className}></i>
                <span id="player_switch_status" > {this.state.text} </span>
            </div>
        );
    }

    handleClick() {
        let howler = this.props.howler;
        let timeline = this.props.timeline;
        if (this.state.playing) {
            howler.pause();
            console.log('%c ---- HOWLER PAUSE ----', 'color: firebrick;');
            // ee.emit(EventEnum.HowlerPauseEvent, new HowlerPauseEvent(Date.now(), this));
            howler.pause();
            console.log('%c ---- HOWLER PAUSE ----', 'color: firebrick;');
            timeline.pause();
            console.log('%c ---- TIMELINE PAUSE ----', 'color: darkorange;');
            this.setState({
                style: { backgroundColor: "rgba(228, 135, 15, 0.8)" },
                className: "fas fa-play",
                text: "Play",
                playing: false
            })
        } else {
            howler.play();
            console.log('%c ---- HOWLER PLAY ----', 'color: firebrick;');
            // ee.emit(EventEnum.HowlerResumeEvent, new HowlerResumeEvent(Date.now(), this));
            timeline.resume();
            console.log('%c ---- TIMELINE PLAY ----', 'color: darkorange;');
            this.setState({
                style: { backgroundColor: "rgba(15, 114, 228, 0.9)" },
                className: "fas fa-pause",
                text: "Pause",
                playing: true
            })
        }
    }


    componentDidMount() {
        let _that = this;
        this.props.howler.on('load', function () {
            console.log('%c ---- Howler LOADED ----', 'color: firebrick;');
            _that.setState({
                style: { backgroundColor: "rgba(228, 135, 15, 0.8)" },
                className: "fas fa-play",
                text: "Play"
            });
        });
        // ee.on(EventEnum.HowlerLoadEvent, (e) => {
        //     console.log('%c ---- Howler LOADED ----', 'color: firebrick;');
        //     this.setState({
        //         style: { backgroundColor: "rgba(228, 135, 15, 0.8)" },
        //         className: "fas fa-play",
        //         text: "Play"
        //     })
        // })
    }
}

export default PlaySwitch;