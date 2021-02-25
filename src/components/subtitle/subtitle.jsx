import React, { Component } from 'react';
import ee from '../../utilities/event-emitter';
import CaptionLoader from '../../enities/Caption/CaptionLoader';
import './subtitle.scss';


class Subtitle extends Component {
  constructor(props) {
    super(props);

    this.cp = new CaptionLoader();
    // track 1 -> first demo

    this.state = {
      captions: [],
      currentString: " * (Kein Untertitel verfügbar) * ",
      playIndex: 0,
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
    } else {
      style.opacity = 0;
    }

    return (
      <span id='closed_captions' style={style}> {this.state.currentString} </span>
    );
  }

  componentDidMount() {
    this.ee.addListener("cc", (obj) => {
      // console.log(obj);
      if (obj.playIndex >= 1 && obj.playIndex != this.state.playIndex) {
        this.cp.initiate(obj.playIndex);

        this.setState({
          captions: this.cp.getCaptions(),
          display: obj.value,
          playIndex: obj.playIndex,
          howler: obj.howler
        })
      } else {
        this.setState({
          display: obj.value,
          howler: obj.howler
        })
      }
    })

    setInterval(() => {
      // if(this.state.howler.playing()) {
      if (this.state.howler.state() == 'loaded') {
        // console.log(this.state.howler);
        let seek = this.state.howler.seek();
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

    this.ee.on("stage_init", () => {
      this.setState({
        captions: [],
        currentString: " * (Bitte wählen Sie eine Ausschnitt) * ",
        seek: 0,
        howler: undefined,
      })
    });

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
