import React, { Component } from 'react';
class Navigator extends Component {
    constructor(props) {
        super(props);
        const secondFormatter = (sec) => {
            if (sec >= 60) {
                if (sec % 60 < 10) {
                    return `${Math.floor(sec / 60)}:0${(sec % 60)}`;
                }
                return `${Math.floor(sec / 60)}:${(sec % 60)}`;
            } else {
                return `0:${sec}`;
            }
        };
        this.contents = this.props.ILV.ILVObject.getSlides().map((slide) => {
            console.log(slide.startTime, slide.startTime + slide.duration);
            return (<span key={slide.sid}>{slide.page}.
                <span className="content_item" id={`NID_${slide.sid}`} data-start-time={slide.startTime} onClick={() => { this.props.ILV.ILVTimeline.timelineSeek(slide.startTime) }}>{slide.name}</span>
           &nbsp;({secondFormatter(slide.startTime)} - {secondFormatter(slide.startTime + slide.duration)})<br />
            </span>);
        }
        );
    }

    render() {
        return (
            <div id='player-navigator'>
                <strong>Contents</strong><br />
                {this.contents}
            </div>
        )
    }
}

export default Navigator;