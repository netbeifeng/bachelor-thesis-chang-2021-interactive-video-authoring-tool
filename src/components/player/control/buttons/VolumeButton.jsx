import React, { Component } from 'react';

class VolumeButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            level: 2,
            volumeBeforeMute: 50,
            levelBeforeMute: 2,
        }
        this.input_volume = React.createRef("input_volume");
        this.button_volume = React.createRef("button_volume");
    }

    render() {
        return (
            <div id="volume_slider" >
                <i id="volume_icon" className="fas fa-volume-up" ref={this.button_volume}></i>
                <input type="range" id="volume" name="volume" defaultValue={(this.props.ILV.ILVPlayer.volume *100).toFixed(0) } min="0" max="100" step="1" ref={this.input_volume} />
                <span id="volume_value"> {this.props.ILV.ILVPlayer.volume} </span>
            </div>
        );
    }

    componentDidMount() {
        this.button_volume.current.onclick = () => {
            let element = this.button_volume.current;
            if (this.props.ILV.ILVPlayer.muted) {
                this.setState({
                    level: this.state.levelBeforeMute,
                });
                switch (this.state.level) {
                    case 0: { element.className = "fas fa-volume-mute"; break; }
                    case 1: { element.className = "fas fa-volume-down"; break; }
                    case 2: { element.className = "fas fa-volume-up"; break; }
                }
                this.props.ILV.ILVTimeline.howlerVolume(this.state.volumeBeforeMute);
            } else {
                this.setState({
                    volumeBeforeMute: this.props.ILV.ILVPlayer.volume,
                    levelBeforeMute: this.state.level,
                });
                element.className = "fas fa-volume-mute";
                this.setState({
                    level: 0,
                });
                this.props.ILV.ILVTimeline.howlerVolume(0);

            }
        }

        this.input_volume.current.onmousemove = () => {
            let element = this.input_volume.current;
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
            this.props.ILV.ILVTimeline.howlerVolume((element.value / 100).toFixed(2));
        }
    }
}

export default VolumeButton;