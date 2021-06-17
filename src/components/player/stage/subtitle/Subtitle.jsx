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
    var _that = this;
    var cues = [];
    var lastCue = null;
    // var pastCues = [];
    var index = 0;
    var currentCue = null;
    this.props.ILV.ILVTimeline.howlerTimeline.on('load', function () {
      cues = _that.props.ILV.ILVObject.getCues();
      // console.log(cues.length);
      if (cues.length > 0) {
        currentCue = cues[index];
        _that.setState({
          currentString: currentCue.getText()
        });
        setInterval(refresh, 500, _that);
      }
    });

    function refresh(_that) {
      let seek = parseFloat(_that.props.ILV.ILVPlayer.currentTiming);
      // console.log(seek);
      if (_that.props.ILV.ILVPlayer.playing && seek > 0) {
        if (seek >= currentCue.getEnd()) {
          while (seek >= currentCue.getEnd() && (index + 1 <= cues.length)) {
            index++;
            // console.log(index);
            lastCue = cues[index - 1];
            currentCue = cues[index];
          }
        } else if ((currentCue && lastCue) && seek < currentCue.getStart() && seek < lastCue.getEnd()) {
          while (seek <= currentCue.getStart()) {
            index--;
            // console.log(index);
            lastCue = cues[index - 1];
            currentCue = cues[index];
          }
        }

        let currentCueText = currentCue.getText();
        if(currentCueText != _that.state.currentString) {
          console.log("Switching Cue: " + currentCueText);
          _that.setState({
            currentString: currentCueText
          });
        }
      }
    }
  }
}

export default Subtitle;
