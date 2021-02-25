import React, { Component, createRef, useRef } from 'react';
import ee from '../../../utilities/event-emitter';

class PlaySwitch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playing: false,
            disabled: true,
            firstPlay: true
        }

        // this.howler = this.props.howler;

        this.player_switch = React.createRef("player_switch");
    }

    render() {
        // console.log(this.state.disabled);
        if (this.state.disabled) {
            return (
                <div id="player_switch" ref={this.player_switch} style={{ backgroundColor: "rgba(46, 46, 46, 0.9)", cursor: "not-allowed" }}>
                    <i id='play' className="fas fa-ban"></i>
                    <span id="player_switch_status" > Play </span>
                </div>
            )
        } else {
            if (!this.state.playing) {
                return (
                    <div id="player_switch" ref={this.player_switch} style={{ backgroundColor: "rgba(228, 135, 15, 0.9)" }}>
                        <i id='play' className="fas fa-play"></i>
                        <span id="player_switch_status" > Play </span>
                    </div>
                );
            } else {
                return (
                    <div id="player_switch" ref={this.player_switch} style={{ backgroundColor: "rgba(15, 114, 228, 0.9)" }}>
                        <i id='play' className="fas fa-pause"></i>
                        <span id="player_switch_status" > Pause </span>
                    </div>
                );
            }
        }

    }
    
    componentDidUpdate(nextProps){
        // console.log(nextProps);
        // this.setState({})
        // console.log(nextProps.howler);
        // console.log(nextProps);
        // this.setState({
        //     playing: nextProps.playing
        // })
        
        let howler = nextProps.howler;
        // this.state.disabled = nextProps.disabled;
        // this.state.playing = nextProps.playing;
        this.player_switch.current.onclick = () => {
            if(!this.state.disabled) {
                if (this.state.playing) {
                    howler.pause();
                    ee.emit("howler_pause", {});
                    this.setState({ playing: false });
                } else {
                    howler.play();
                    ee.emit("howler_replay", {});
                    this.setState({ playing: true });
                }
            }
        };
    }

    componentDidMount() {
        let howler = this.props.howler;
        // this.setState({
        //     disabled: this.props.disabled,
        //     playing: this.props.playing
        // })
        this.player_switch.current.onclick = () => {
            // console.log(howler);
            if(!this.state.disabled) {
                if (this.state.playing) {
                    howler.pause();
                    ee.emit("howler_pause", {});
                    this.setState({ playing: false });
                } else {
                    howler.play();
                    // if (this.state.firstPlay) {
                    //     this.state.firstPlay = false;
                    //     ee.emit("scene_change", { scene: 1 });
                    // } else {
                    ee.emit("howler_replay", {});
                    // }
                    this.setState({ playing: true });
                }
            }
        };

        ee.on("stage_init", () => {
            this.setState({
                playing: false,
                disabled: true
            })
        });

        ee.on("scene_change_var", (e) => {
            if(e.scene >= 1) {
                this.setState({
                    playing: true,
                    disabled: false
                })
            }
        })

        // ee.on("howler_play", (obj) => {
        //     if (obj.track == 1) {
        //         // TODO 
        //         // this.player_switch.current
        //     }
        //     howler.play();
        //     this.setState({ playing: true, disabled: false });
        // });
    }


}

export default PlaySwitch;