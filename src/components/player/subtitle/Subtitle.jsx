import React, { Component } from 'react';
import ee from '../../../utilities/event-emitter';
// import CaptionLoader from '../../enities/Caption/CaptionLoader';
import './Subtitle.scss';
import EventEnum from '../../../enities/Event/EventEnum';
// import ILVObject from '../../../utilities/ILVObject';


class Subtitle extends Component {
  state = {
    cues: [],
    currentString: " * (Kein Untertitel verfügbar) * ",
    seek: 0,
    // howler: undefined,
    display: false
  }

  // cp = new CaptionLoader();

  constructor(props) {
    super(props);
    this.ee = ee;
  }

  renderStyle() {
    let style = {};
    if (this.state.display) {
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
    this.ee.on(EventEnum.ClosedCaptionEvent, (e) => {
      this.setState({
        display: e.value
      });
    });

    // this.ee.on(EventEnum.HowlerLoadEvent, (e) => {
    // this.cp.initiate();
    let cues = this.props.ILV.getCues();
    this.setState({
      cues: cues == undefined ? [] : cues,
      // howler: e.howler
    })
    // })

    setInterval(() => {
      if (this.props.hgTimeline.howlerTimeline && this.props.hgTimeline.howlerTimeline.state() == 'loaded') {
        let seek = this.props.hgTimeline.howlerTimeline.seek();
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
