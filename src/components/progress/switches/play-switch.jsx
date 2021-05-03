import React, { Component, createRef, useRef } from 'react';
import EventEnum from '../../../enities/Event/EventEnum';
import HowlerPauseEvent from '../../../enities/Event/HowlerPauseEvent';
import HowlerResumeEvent from '../../../enities/Event/HowlerResumeEvent';
import ee from '../../../utilities/event-emitter';

class PlaySwitch extends Component {

    state = {
        playing: false,
        disabled: true,
        firstPlay: true
    }

    constructor(props) {
        super(props);
    }

    render() {
        let button = this.renderButton();
        return (
            <div id="player_switch" style={button.style} onClick={this.handleClick.bind(this)}>
                <i id='play' className={button.className}></i>
                <span id="player_switch_status" > {button.text} </span>
            </div>
        );
    }

    renderButton() {
        let button = {
            style: undefined,
            className: "",
            text: ""
        }
        if (this.state.disabled) {
            button.style = { backgroundColor: "rgba(46, 46, 46, 0.8)", cursor: "not-allowed" };
            button.className = "fas fa-ban";
            button.text = "Load";
        } else {
            if (!this.state.playing) {
                button.style = { backgroundColor: "rgba(228, 135, 15, 0.8)" };
                button.className = "fas fa-play";
                button.text = "Play";
            } else {
                button.style = { backgroundColor: "rgba(15, 114, 228, 0.9)" };
                button.className = "fas fa-pause";
                button.text = "Pause";
            }
        }

        return button;
    }

    handleClick() {
        let howler = this.props.howler;

        if (!this.state.disabled) {
            if (this.state.playing) {
                howler.pause();
                console.log('%c ---- Howler PAUSE ----', 'color: firebrick;');
                ee.emit(EventEnum.HowlerPauseEvent, new HowlerPauseEvent(Date.now(), this));
                this.setState({ playing: false });
            } else {
                howler.play();
                console.log('%c ---- Howler PLAY ----', 'color: firebrick;');
                ee.emit(EventEnum.HowlerResumeEvent, new HowlerResumeEvent(Date.now(), this));
                this.setState({ playing: true });
            }
        }
    }

    componentDidMount() {
        ee.on(EventEnum.HowlerLoadEvent, (e) => {
            console.log('%c ---- Howler LOADED ----', 'color: firebrick;');
            this.setState({
                playing: false,
                disabled: false
            })
        })
    }
}

export default PlaySwitch;