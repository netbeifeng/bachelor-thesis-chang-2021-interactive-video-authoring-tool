import Draggable from 'react-draggable';
import React, { Component } from 'react';
import './Slider.scss';
import { gsap } from 'gsap';

class Slider extends Component {

    constructor(props) {
        super(props);

        this.state = {
            slide_point: [],
            slide_map: this.props.ILV.ILVObject.getSlides(),
            progress_text: "-  📼  -",
            progress_width: "0px"
        }


        this.dragging = false;

        this.progress_dot = React.createRef("progress_dot");
        this.progress_bg = React.createRef("progress_bg");
    }

    render() {
        return (
            <div>
                <div id="progress-text">
                    <span>{this.state.progress_text}</span>
                </div>
                <div id="progress-bg" ref={this.progress_bg}></div>
                <div id="progress-transparent" onClick={this.handle_progress_click} onMouseMove={this.handle_mouse_move} onMouseLeave={this.handle_mouse_leave}>
                    <Draggable
                        axis="x"
                        handle=".progress_dot"
                        defaultPosition={{ x: 0, y: -10 }}
                        bounds="parent"
                        scale={1}
                        onStart={this.handleStart}
                        onDrag={this.handleDrag}
                        onStop={this.handleStop}>
                        <span id="progress_dot" className="progress_dot" ref={this.progress_dot}></span>
                    </Draggable>
                    {this.state.slide_point}
                </div>
                <div id="progress" style={{ width: this.state.progress_width }}></div>
            </div>
        )
    }

    componentDidMount() {
        let forward = document.getElementById('forward');
        let backward = document.getElementById('backward');
        let pausing = document.getElementById('pausing');
        let _that = this;


        // listener for howler audio load
        this.props.ILV.ILVTimeline.howlerTimeline.on('load', function () {
            window.addEventListener('keydown', (ev) => {
                if (ev.code == "Space") {
                    if (_that.props.ILV.ILVPlayer.playing) {
                        pausing.style.visibility = 'visible';
                        pausing.style.opacity = 1;
                    } else {
                        pausing.style.visibility = 'hidden';
                        pausing.style.opacity = 0;
                    }
                    document.getElementById("player_switch").click();
                }
            })
            _that.setState({
                progress_text: "0:00 / " + _that.fmtMSS(~~_that.props.ILV.ILVTimeline.howlerTimeline.duration())
            });
            setInterval(() => {
                if (_that.props.ILV.ILVPlayer.playing) {
                    console.log(`%c CurrentTiming Update: ${_that.props.ILV.ILVPlayer.currentTiming}`, 'color: #5865F2;');
                    _that.props.ILV.ILVPlayer.updatePlayerCurrentTiming(_that.props.ILV.ILVTimeline.howlerTimeline.seek().toFixed(0));
                }
            }, 1000);
            _that.generatePointTag();
        });

        // listener for howler play
        this.props.ILV.ILVTimeline.howlerTimeline.on('play', function () {
            window.addEventListener('keydown', (ev) => {
                switch (ev.code) {
                    case "ArrowRight": {
                        _that.props.ILV.ILVTimeline.timelineSeek(parseInt(_that.props.ILV.ILVPlayer.currentTiming) + 2);
                        forward.style.visibility = 'visible';
                        forward.style.opacity = 1;
                        setTimeout(() => {
                            forward.style.visibility = 'hidden';
                            forward.style.opacity = 0;
                        }, 300);
                        break;
                    }

                    case "ArrowLeft": {
                        _that.props.ILV.ILVTimeline.timelineSeek(parseInt(_that.props.ILV.ILVPlayer.currentTiming) - 2);
                        backward.style.visibility = 'visible';
                        backward.style.opacity = 1;
                        setTimeout(() => {
                            backward.style.visibility = 'hidden';
                            backward.style.opacity = 0;
                        }, 300);
                        break;
                    }

                    case "ArrowUp": {
                        console.log(_that.props.ILV.ILVPlayer.volume);
                        if (_that.props.ILV.ILVPlayer.volume < 0.95) {
                            _that.props.ILV.ILVTimeline.howlerVolume(parseFloat(parseFloat(_that.props.ILV.ILVPlayer.volume + 0.05).toFixed(2)));
                        }
                        break;
                    }

                    case "ArrowDown": {
                        if (_that.props.ILV.ILVPlayer.volume > 0.05) {
                            _that.props.ILV.ILVTimeline.howlerVolume(parseFloat(parseFloat(_that.props.ILV.ILVPlayer.volume - 0.05).toFixed(2)));
                        }
                        break;
                    }
                    default: { break; }
                }
            });
            window.requestAnimationFrame(step);
            function step() {
                let seek = _that.props.ILV.ILVTimeline.howlerTimeline.seek();
                let duration = _that.props.ILV.ILVPlayer.duration;

                if (_that.props.ILV.ILVPlayer.playing) {
                    window.requestAnimationFrame(step);
                    _that.setState({
                        progress_text: (_that.fmtMSS(~~seek) + " / " + _that.fmtMSS(~~duration))
                    })
                    if (Math.abs(seek - duration) <= 0.5) {
                        _that.setState({
                            progress_width: '80%'
                        });
                        _that.progress_dot.current.style.left = _that.progress_dot.current.parentNode.width - 15 + 'px';
                    } else if (seek != 0 && !_that.dragging) {
                        _that.setState({
                            progress_width: (seek / duration) * 80 + '%'
                        });
                        _that.progress_dot.current.setAttribute('style', `transform: translate(${((seek / duration) * (_that.progress_dot.current.parentNode.clientWidth)).toFixed(2)}px, -10px)`)
                    }
                }
            }
        })
        this.setUpProgressListners();
    }

    setUpProgressListners() {
        this.handle_mouse_move = (e) => {
            if (e.target.id == 'progress-transparent' && (e.screenX - e.target.offsetLeft) < 2e3 ) {
                let tip = this.fmtMSS(((e.screenX - e.target.offsetLeft) / (e.target.offsetWidth) * this.props.ILV.ILVPlayer.duration).toFixed(0));
                if (document.getElementById('progress_time_tip')) {
                    let progress_time_tip = document.getElementById('progress_time_tip');
                    progress_time_tip.innerHTML = tip;
                    progress_time_tip.style.left = (e.screenX - e.target.offsetLeft) - 25 + 'px';
                    // if (e.screenX > 1e3) {
                    //     progress_time_tip = 0 + 'px';
                    // }
                } else {
                    let progress_time_tip = document.createElement('span');
                    progress_time_tip.id = 'progress_time_tip';
                    progress_time_tip.innerHTML = tip;
                    progress_time_tip.style.left = (e.screenX - e.target.offsetLeft) - 25 + 'px';
                    // console.log((e.screenX - e.target.offsetLeft));

                    // if((e.screenX - e.target.offsetLeft) > e.screenX) {
                    //     progress_time_tip = e.screenX / 10 + 'px';
                    // }
                    e.target.append(progress_time_tip);
                }
            }
        }

        this.handle_mouse_leave = (e) => {
            if (e.target.id == 'progress-transparent') {
                let tip = document.getElementById('progress_time_tip');
                if (tip)
                    e.target.removeChild(tip);
            }
        }

        this.handleStart = () => {
            this.dragging = true;
        }

        this.handleDrag = () => {
            let str = this.progress_dot.current.style.transform;
            let x = parseInt(str.substring(0, str.indexOf(',')).replace(/[^\d.]/g, ''));
            let percentage = ((x) / this.progress_bg.current.clientWidth);
            this.props.ILV.ILVTimeline.timelineSeek(Math.round(percentage * this.props.ILV.ILVPlayer.duration), 'gsap');
            this.setState({
                progress_width: `${percentage * 80}%`
            });
        }

        this.handleStop = () => {
            let str = this.progress_dot.current.style.transform;
            let x = parseInt(str.substring(0, str.indexOf(',')).replace(/[^\d.]/g, ''));
            let percentage = ((x) / this.progress_bg.current.clientWidth);
            let seek = Math.round(percentage * this.props.ILV.ILVPlayer.duration);
            this.props.ILV.ILVTimeline.timelineSeek(seek);
            if (this.dragging) {
                this.dragging = false;
            }
        }

        this.handle_progress_click = (e) => {
            if (e.target.id === "progress-transparent" && this.props.ILV.ILVPlayer.playing) {
                let seek = Math.round(e.nativeEvent.offsetX / Math.round(e.target.getBoundingClientRect().width) * this.props.ILV.ILVPlayer.duration);
                this.props.ILV.ILVTimeline.timelineSeek(seek);
            }
        };
    }

    fmtMSS(s) {
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }

    generatePointTag() {
        let _that = this;
        let array = [];
        let handle_onMouseEnter = (e) => {
            let target = e.target;
            let id = target.id.split('_')[2];
            let tag_element = document.createElement('span');
            tag_element.id = `progress_point_tag_${id}`;
            tag_element.className = "progress_point_tag";
            tag_element.innerHTML = _that.state.slide_map[id - 1].name;
            target.appendChild(tag_element);
        };

        let handle_onMouseLeave = (e) => {
            let target = e.target;
            target.firstChild.remove();
        };

        let handle_onMouseClick = (e) => {
            let target = e.target;
            if (target.className === "progress_point" && _that.props.ILV.ILVTimeline.howlerTimeline.playing()) {
                let id = target.id.split('_')[2];
                _that.props.ILV.ILVTimeline.timelineSeek(_that.state.slide_map[id - 1].startTime);
            }
        }

        for (let [index, value] of _that.state.slide_map.entries()) {
            if (index != 0) {
                let id = `progress_point_${value.page}`;
                let key = `progress_point_key_${index}`;
                let percentage = (value.startTime / _that.props.ILV.ILVPlayer.duration).toFixed(2) * 100;
                let style = {
                    marginLeft: `${percentage}%`
                }
                array.push(<span className="progress_point" id={id} key={key} style={style} onClick={handle_onMouseClick} onMouseEnter={handle_onMouseEnter} onMouseLeave={handle_onMouseLeave}></ span>);
            }
        }

        _that.setState({
            slide_point: array,
        })
    }
}

export default Slider;