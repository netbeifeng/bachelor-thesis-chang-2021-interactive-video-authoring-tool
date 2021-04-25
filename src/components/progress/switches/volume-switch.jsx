import React, { Component, createRef, useRef } from 'react';

class VolumeSwitch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            level: 2,
            volume: 50,
            volumeBeforeMute: 50,
            levelBeforeMute: 2,
            muted: false
        }
        this.input_volume = React.createRef("input_volume");
        this.button_volume = React.createRef("button_volume");
    }

    render() {
        return (
            <div id="volume_slider" >
                <i id="volume_icon" className="fas fa-volume-up" ref={this.button_volume}></i>
                <input type="range" id="volume" name="volume" defaultValue={this.state.volume} min="0" max="100" step="1" ref={this.input_volume} />
                <span id="volume_value"> {this.state.volume} </span>
            </div>
        );
    }

    componentDidMount() {
        let howler = this.props.howler;
        this.button_volume.current.onclick = () => {
            let element = this.button_volume.current;
            if (this.state.muted) {
                this.setState({
                    volume: this.state.volumeBeforeMute,
                    level: this.state.levelBeforeMute,
                    muted: false
                });
                switch (this.state.level) {
                    case 0: { element.className = "fas fa-volume-mute"; break; }
                    case 1: { element.className = "fas fa-volume-down"; break; }
                    case 2: { element.className = "fas fa-volume-up"; break; }
                }
                howler.volume((this.state.volumeBeforeMute / 100).toFixed(2));
            } else {
                this.setState({
                    volumeBeforeMute: this.state.volume,
                    levelBeforeMute: this.state.level,
                });

                element.className = "fas fa-volume-mute";

                this.setState({
                    volume: 0,
                    level: 0,
                    muted: true
                });
                howler.volume(0);
            }
        }

        this.input_volume.current.onmousemove = () => {
            let element = this.input_volume.current;
            this.setState({
                volume: element.value
            })
            if (element.value >= 50) {
                this.setState({
                    level: 2
                })
            } else if (element.value > 0 && element.value < 50) {
                this.setState({
                    level: 1
                })
            } else {
                this.setState({
                    level: 0
                })
            }

            switch (this.state.level) {
                case 0: { this.button_volume.current.className = "fas fa-volume-mute"; break; }
                case 1: { this.button_volume.current.className = "fas fa-volume-down"; break; }
                case 2: { this.button_volume.current.className = "fas fa-volume-up"; break; }
            }

            howler.volume((element.value / 100).toFixed(2));
        }
    }
}

export default VolumeSwitch;