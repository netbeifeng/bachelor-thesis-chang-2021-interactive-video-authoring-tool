import React, { Component, createRef, useRef } from 'react';
import ClosedCaptionEvent from '../../../enities/Event/ClosedCaptionEvent';
import EventEnum from '../../../enities/Event/EventEnum';
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
                <div id="cc_switch" ref={this.cc_switch} style={{ backgroundColor: 'rgba(34, 139, 34, 0.7)' }}>
                    <i className="far fa-closed-captioning"></i>
                    <span id="cc_switch_status"> On </span>
                </div>
            )
        } else {
            return (
                <div id="cc_switch" ref={this.cc_switch} style={{ backgroundColor: 'rgba(178, 34, 34, 0.7)' }}>
                    <i className="far fa-closed-captioning"></i>
                    <span id="cc_switch_status"> Off </span>
                </div>
            );
        }
    }

    componentDidMount() {
        let howler = this.props.howler;
        if (this.state.ccEnabled) {
            this.ee.emit(EventEnum.ClosedCaptionEvent, new ClosedCaptionEvent(Date.now(), this, true));
        } else {
            this.ee.emit(EventEnum.ClosedCaptionEvent, new ClosedCaptionEvent(Date.now(), this, false));
        }

        this.cc_switch.current.onclick = () => {
            if (this.state.ccEnabled) {
                this.ee.emit(EventEnum.ClosedCaptionEvent, new ClosedCaptionEvent(Date.now(), this, false));
            } else {
                this.ee.emit(EventEnum.ClosedCaptionEvent, new ClosedCaptionEvent(Date.now(), this, true));
            }
            this.setState({
                ccEnabled: !this.state.ccEnabled
            })
        };
    }
}

export default ClosedCaptionSwitch;