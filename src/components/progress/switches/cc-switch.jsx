import React, { Component, createRef, useRef } from 'react';
import ClosedCaptionEvent from '../../../enities/Event/ClosedCaptionEvent';
import EventEnum from '../../../enities/Event/EventEnum';
import ee from '../../../utilities/event-emitter';

class ClosedCaptionSwitch extends Component {

    state = {
        ccEnabled: false,
        bgColor: 'rgba(34, 139, 34, 0.7)',
        status: 'On'
    };

    constructor(props) {
        super(props);
        this.ee = ee;
    }

    render() {
        return( <div id="cc_switch" style={{ backgroundColor: this.state.bgColor }} onClick={this.handleClick.bind(this)}>
            <i className="far fa-closed-captioning"></i>
            <span id="cc_switch_status"> {this.state.status} </span>
        </div>);
        // if (this.state.ccEnabled) {
        //     return (

        //     )
        // } else {
        //     return (
        //         <div id="cc_switch" style={{ backgroundColor: 'rgba(178, 34, 34, 0.7)' }} onClick={this.handleClick.bind(this)}>
        //             <i className="far fa-closed-captioning"></i>
        //             <span id="cc_switch_status"> Off </span>
        //         </div>
        //     );
        // }
    }

    handleClick() {
        if (this.state.ccEnabled) {
            this.ee.emit(EventEnum.ClosedCaptionEvent, new ClosedCaptionEvent(Date.now(), this, false));
            this.setState({
                ccEnabled: !this.state.ccEnabled,
                bgColor: 'rgba(34, 139, 34, 0.7)',
                status: 'On'
            });
        } else {
            this.ee.emit(EventEnum.ClosedCaptionEvent, new ClosedCaptionEvent(Date.now(), this, true));
            this.setState({
                ccEnabled: !this.state.ccEnabled,
                bgColor: 'rgba(178, 34, 34, 0.7)',
                status: 'Off'
            });
        }
    }

    componentDidMount() {
        // if (this.state.ccEnabled) {
        //     this.ee.emit(EventEnum.ClosedCaptionEvent, new ClosedCaptionEvent(Date.now(), this, true));
        // } else {
        //     this.ee.emit(EventEnum.ClosedCaptionEvent, new ClosedCaptionEvent(Date.now(), this, false));
        // }
    }
}

export default ClosedCaptionSwitch;