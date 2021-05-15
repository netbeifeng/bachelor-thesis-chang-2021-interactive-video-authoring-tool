import React, { Component, createRef, useRef } from 'react';


class PlayButton extends Component {

    state = {
        style: { backgroundColor: "rgba(46, 46, 46, 0.8)", cursor: "not-allowed" },
        className: "fas fa-ban",
        text: "Load"
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="player_switch" style={this.state.style} onClick={this.handleClick.bind(this)}>
                <i id='play' className={this.state.className}></i>
                <span id="player_switch_status" > {this.state.text} </span>
            </div>
        );
    }

    handleClick() {
        if (this.props.ILV.ILVPlayer.playing) {
            this.props.ILV.ILVTimeline.timelinePause();

            console.log('%c ---- TIMELINE PAUSE ----', 'color: darkorange;');
            this.setState({
                style: { backgroundColor: "rgba(228, 135, 15, 0.8)" },
                className: "fas fa-play",
                text: "Play",
            })
        } else {
            this.props.ILV.ILVTimeline.timelinePlay();

            console.log('%c ---- TIMELINE PLAY ----', 'color: darkorange;');
            this.setState({
                style: { backgroundColor: "rgba(15, 114, 228, 0.9)" },
                className: "fas fa-pause",
                text: "Pause",
            })
        }
    }


    componentDidMount() {
        let _that = this;
        this.props.ILV.ILVTimeline.howlerTimeline.on('load', function () {
            console.log('%c ---- Howler LOADED ----', 'color: firebrick;');
            _that.setState({
                style: { backgroundColor: "rgba(228, 135, 15, 0.8)" },
                className: "fas fa-play",
                text: "Play"
            });
        });
    }


}

export default PlayButton;