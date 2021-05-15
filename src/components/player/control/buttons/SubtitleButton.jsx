import React, { Component } from 'react';

// import ee from '../../../../utilities/event-emitter';

class SubtitleButton extends Component {

    state = {
        bgColor: 'rgba(34, 139, 34, 0.7)',
        status: 'On'
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (<div id="cc_switch" style={{ backgroundColor: this.state.bgColor }} onClick={this.handleClick.bind(this)}>
            <i className="far fa-closed-captioning"></i>
            <span id="cc_switch_status"> {this.state.status} </span>
        </div>);
    }

    handleClick() {
        if (this.props.ILV.ILVPlayer.caption.captionDisplay) {
            this.props.ILV.ILVPlayer.caption.changeCaptionDisplayState();
            this.setState({
                bgColor: 'rgba(34, 139, 34, 0.7)',
                status: 'On'
            });
        } else {
            this.props.ILV.ILVPlayer.caption.changeCaptionDisplayState();
            this.setState({
                bgColor: 'rgba(178, 34, 34, 0.7)',
                status: 'Off'
            });
        }
    }
}

export default SubtitleButton;