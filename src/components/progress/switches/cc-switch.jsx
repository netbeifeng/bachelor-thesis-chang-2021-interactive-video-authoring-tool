import React, { Component, createRef, useRef } from 'react';
import ee from '../../../utilities/event-emitter';

class ClosedCaptionSwitch extends Component {
    constructor(props) {
        super(props);
        this.ee = ee;
        this.state = {
            ccEnabled: true
        };
        this.cc_switch = React.createRef("cc_switch");
    }

    render() {
        if (this.state.ccEnabled) {
            return (
                <div id="cc_switch" ref={this.cc_switch} style={{ backgroundColor: 'rgba(34, 139, 34, 0.9)' }}>
                    <i className="far fa-closed-captioning"></i>
                    <span id="cc_switch_status"> On </span>
                </div>
            )
        } else {
            return (
                <div id="cc_switch" ref={this.cc_switch} style={{ backgroundColor: 'rgba(178, 34, 34, 0.9)' }}>
                    <i className="far fa-closed-captioning"></i>
                    <span id="cc_switch_status"> Off </span>
                </div>
            );
        }
    }

    componentDidMount() {
        // this.changeState(element);
        let howler = this.props.howler;
        if (this.state.ccEnabled) {
            this.ee.emit("cc", { event: "On", value: true, opacity: 1, time: Date.now(), howler: howler, playIndex: this.props.playIndex });
        } else {
            this.ee.emit("cc", { event: "Off", value: false, opacity: 0, time: Date.now(), howler: howler, playIndex: this.props.playIndex });
        }

        this.cc_switch.current.onclick = () => {
            // this.changeState(element);
            if (this.state.ccEnabled) {
                this.ee.emit("cc", { event: "Off", value: false, opacity: 0, time: Date.now(), howler: howler, playIndex: this.props.playIndex });
            } else {
                this.ee.emit("cc", { event: "On", value: true, opacity: 1, time: Date.now(), howler: howler, playIndex: this.props.playIndex });
            }
            this.setState({
                ccEnabled: !this.state.ccEnabled
            })
        };
    }

    componentDidUpdate(nextProps) { 
        let howler = nextProps.howler;
        // console.log(howler);
        if (this.state.ccEnabled) {
            this.ee.emit("cc", { event: "On", value: true, opacity: 1, time: Date.now(), howler: howler, playIndex: nextProps.playIndex });
        } else {
            this.ee.emit("cc", { event: "Off", value: false, opacity: 0, time: Date.now(), howler: howler, playIndex: nextProps.playIndex });
        }
        this.cc_switch.current.onclick = () => {
            // this.changeState(element);
            if (this.state.ccEnabled) {
                this.ee.emit("cc", { event: "Off", value: false, opacity: 0, time: Date.now(), howler: howler, playIndex: nextProps.playIndex });
            } else {
                this.ee.emit("cc", { event: "On", value: true, opacity: 1, time: Date.now(), howler: howler, playIndex: nextProps.playIndex });
            }
            this.setState({
                ccEnabled: !this.state.ccEnabled
            })
        };
    }

    // changeState(element) {
    //     let time = Date.now();

    //     if (this.state.ccEnabled) {
    //         element.lastChild.innerHTML = " Off ";
    //         element.style.backgroundColor = "rgba(178, 34, 34, 0.9)";
    //         this.ee.emit("cc", { event: "Off", value: false, opacity: 0, time: time });
    //     } else {
    //         element.lastChild.innerHTML = " On ";
    //         element.style.backgroundColor = "rgba(34, 139, 34, 0.9)";
    //         this.ee.emit("cc", { event: "On", value: true, opacity: 1, time: time });
    //     }
    // }
}

export default ClosedCaptionSwitch;