import React, { Component } from 'react';
import ee from '../../utilities/event-emitter';
import CaptionLoader from '../../enities/Caption/CaptionLoader';
import './Subtitle.scss';
import EventEnum from '../../enities/Event/EventEnum';


class Subtitle extends Component {
  constructor(props) {
    super(props);

    this.cp = new CaptionLoader();

    this.state = {
      captions: [],
      currentString: " * (Kein Untertitel verfügbar) * ",
      // playIndex: 0,
      seek: 0,
      howler: undefined,
      display: true
    }

    this.ee = ee;
  }

  render() {
    let style = {};
    // console.log(this.state.display);
    if (this.state.display) {
      style.opacity = 1;
      style.zIndex = '3';
    } else {
      style.opacity = 0;
      style.zIndex = '-1';
    }

    return (
      <span id='closed_captions' style={style}> {this.state.currentString} </span>
    );
  }

  componentDidMount() {

    this.ee.on(EventEnum.HowlerLoadEvent, (e) => {
      // console.log('!!!!!!!!!!');
      this.cp.initiate();
      this.setState({
        captions: this.cp.getCaptions(),
        howler: e.howler
      })
    })

    setInterval(() => {
      // if(this.state.howler.playing()) {
        // console.log(this.state.howler && this.state.howler.state() == 'loaded');
      if (this.state.howler && this.state.howler.state() == 'loaded') {
        // console.log(this.state.howler);
        let seek = this.state.howler.seek();
        // console.log(this.state.captions.length);
        if (this.state.captions.length > 0) {
          for (let cue of this.state.captions) {
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
      // }
    }, 500);

    // this.ee.on(EventEnum.PIXIStageInitEvent, () => {
    //   this.setState({
    //     currentString: " * (Bitte wählen Sie eine Ausschnitt) * ",
    //     seek: 0,
    //     howler: undefined,
    //   })
    // });

    // this.ee.on("howler_seek", (obj) => {
    //   this.setState({
    //     seek: obj.seek
    //   })
    //   let seek = obj.seek;
    //   for (let cue of this.state.captions) {
    //     if (cue.getStart() <= seek && cue.getEnd() >= seek) {
    //       this.setState({
    //         currentString: cue.getText()
    //       })
    //     }
    //   }
    // });
  }
}

export default Subtitle;
