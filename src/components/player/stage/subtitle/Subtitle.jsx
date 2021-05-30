import React, { Component } from 'react';
// import CaptionLoader from '../../enities/Caption/CaptionLoader';
import './Subtitle.scss';
// import ILVObject from '../../../utilities/ILVObject';


class Subtitle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentString: " * (Kein Untertitel verfügbar) * "
    }
  }

  renderStyle() {
    let style = {};
    if (this.props.ILV.ILVPlayer.caption.captionDisplay) {
      style.opacity = 1;
      style.zIndex = '3';
    } else {
      style.opacity = 0;
      style.zIndex = '-1';
    }
    return style;
  }

  render() {
    return (
      <span id='closed_captions' style={this.renderStyle()}> {this.state.currentString} </span>
    );
  }

  componentDidMount() {
    function refresh(_that) {
      if (_that.props.ILV.ILVTimeline.howlerTimeline && _that.props.ILV.ILVTimeline.howlerTimeline.state() == 'loaded') {
        let seek = _that.props.ILV.ILVPlayer.currentTiming;
        
          if(_that.props.ILV.ILVObject.getCues().length > 0) {
            for (let cue of _that.props.ILV.ILVObject.getCues()) {
          if (cue.getStart() <= seek && cue.getEnd() >= seek) {
            _that.setState({
              currentString: cue.getText()
            })
          }
        }
      } else {
        _that.setState({
          currentString: " * (Kein Untertitel verfügbar) * "
        })
      }
    }
  }
  setInterval(refresh, 500, this);
}
}

export default Subtitle;
