import React, { Component } from 'react';
// import CaptionLoader from '../../enities/Caption/CaptionLoader';
import './Subtitle.scss';
// import ILVObject from '../../../utilities/ILVObject';


class Subtitle extends Component {
  state = {
    cues: [],
    currentString: " * (Kein Untertitel verfügbar) * ",
    seek: 0,
    // howler: undefined,
    // display: false
  }

  // cp = new CaptionLoader();

  constructor(props) {
    super(props);
    // this.ee = ee;
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
    let cues = this.props.ILV.ILVObject.getCues();
    this.setState({
      cues: cues == undefined ? [] : cues,
    })

    setInterval(() => {
      if (this.props.ILV.ILVTimeline.howlerTimeline && this.props.ILV.ILVTimeline.howlerTimeline.state() == 'loaded') {
        let seek = this.props.ILV.ILVTimeline.howlerTimeline.seek();
        if (this.state.cues.length > 0) {
          for (let cue of this.state.cues) {
            if (cue.getStart() <= seek && cue.getEnd() >= seek) {
              this.setState({
                currentString: cue.getText()
              })
            }
          }
        } else {
          this.setState({
            currentString: " * (Kein Untertitel verfügbar) * "
          })
        }
      }
    }, 500);

  }
}

export default Subtitle;
