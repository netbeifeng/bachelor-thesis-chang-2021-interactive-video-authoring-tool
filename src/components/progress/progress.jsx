import React, { Component } from 'react';
import './progress.scss';
import PlaySwitch from './switches/play-switch';
import ClosedCaptionSwitch from './switches/cc-switch';
import VolumeSwitch from './switches/volume-switch';
import Draggable from 'react-draggable';
import PlayRate from './switches/play-rate';


class Progress extends Component {

    constructor(props) {
        super(props);

        this.ILVObject = this.props.ILV;

        this.state = {
            slide_point: [],
            slide_map: this.ILVObject.getSlides(),
            progress_text: "-  📼  -",
            progress_width: "0px"
        }

        this.dragging = false;

        this.progress_dot = React.createRef("progress_dot");
        this.progress_bg = React.createRef("progress_bg");
    }

    render() {
        return (
            <div id="progress_container">
                <div id="progress_bar">
                    <div id="switches">
                        <PlaySwitch howler={this.props.hgTimeline.howlerTimeline} timeline={this.props.hgTimeline.gsapTimeline} />
                        <PlayRate howler={this.props.hgTimeline.howlerTimeline} timeline={this.props.hgTimeline.gsapTimeline} />
                        <ClosedCaptionSwitch />
                        <VolumeSwitch howler={this.props.hgTimeline.howlerTimeline} />
                    </div>

                    <div id="progress_text">
                        <span>{this.state.progress_text}</span>
                    </div>

                    <div id="progress_bg" ref={this.progress_bg}></div>
                    <div id="progress_transparent" onClick={this.handle_progress_click} onMouseMove={this.handle_mouse_move} onMouseLeave={this.handle_mouse_leave}>
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
            </div>
        );
    }

    // buildTimeline() {
    //     this.props.hgTimeline.gsapTimeline.addLabel("start", 0);
    //     for (let animation of this.ILVObject.getAnimations()) {
    //         animation.animate(this.props.hgTimeline.gsapTimeline);
    //     }
    //     this.props.hgTimeline.gsapTimeline.pause();
    // }

    // paintElements() {
    //     for (let slide of this.ILVObject.getSlides()) {
    //         for (let element of slide.getElements()) {
    //             element.paint();
    //         }
    //     }
    // }

    // initPage() {
    //     // console.log('%c ---- PAINTING I-Layer ----', 'color: forestgreen;');
    //     // this.paintElements();
    //     // console.log('%c ---- I-Layer PREPARED ----', 'color: forestgreen;');

    //     // console.log('%c ---- BUILDING TIMELINE ----', 'color: hotpink;');
    //     // this.buildTimeline();
    //     // console.log('%c ---- TIMELINE BUILT ----', 'color: hotpink;');

    //     // this.setUpQuizListner();
    //     // this.setUpNavigationListner();
    //     // console.log('%c ---- Listner PREPARED ----', 'color: blue;');
    // }

    componentDidMount() {
        // this.initPage();
        let _that = this;
        // listener for howler audio load
        this.props.hgTimeline.howlerTimeline.on('load', function () {
            _that.state.duration = _that.getHowlerTimeline().duration();
            _that.setState({
                progress_text: "0:00 / " + _that.fmtMSS(~~_that.getHowlerTimeline().duration())
            })
            _that.generatePointTag();
        });

        // listener for howler play
        this.props.hgTimeline.howlerTimeline.on('play', function () {
            window.requestAnimationFrame(step);
            function step() {
                let howler = _that.getHowlerTimeline();
                let seek = howler.seek() || 0;
                let duration = howler.duration();
                // let currentSlide = _that.ILVObject.getSlidePagebyTime(seek);
                if (howler.playing()) {
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
        // this.setUpPlaybackStateListners();
        this.setUpProgressListners();
    }

    setUpProgressListners() {
        this.handle_mouse_move = (e) => {
            if (e.target.id == 'progress_transparent') {
                let tip = this.fmtMSS(((e.screenX - e.target.offsetLeft) / (e.target.offsetWidth) * this.state.duration).toFixed(0));
                if (document.getElementById('progress_time_tip')) {
                    let progress_time_tip = document.getElementById('progress_time_tip');
                    progress_time_tip.innerHTML = tip;
                    progress_time_tip.style.left = (e.screenX - e.target.offsetLeft) - 25 + 'px';
                } else {
                    let progress_time_tip = document.createElement('span');
                    progress_time_tip.id = 'progress_time_tip';
                    progress_time_tip.innerHTML = tip;
                    progress_time_tip.style.left = (e.screenX - e.target.offsetLeft) - 25 + 'px';
                    e.target.append(progress_time_tip);
                }
            }
        }

        this.handle_mouse_leave = (e) => {
            if (e.target.id == 'progress_transparent') {
                e.target.removeChild(document.getElementById('progress_time_tip'));
            }
        }

        this.handleStart = () => {
            this.dragging = true;
        }

        this.handleDrag = () => {
            let str = this.progress_dot.current.style.transform;
            let x = parseInt(str.substring(0, str.indexOf(',')).replace(/[^\d.]/g, ''));
            let percentage = ((x) / this.progress_bg.current.clientWidth);
            this.gsapTimelineSeek(Math.round(percentage * this.props.hgTimeline.howlerTimeline.duration()));
            this.setState({
                progress_width: `${percentage * 80}%`
            });
            // _that.progress.current.style.width = `${percentage * 80}%`;
        }

        this.handleStop = () => {
            if (!this.props.hgTimeline.howlerTimeline.playing() && this.getHowlerTimeline().seek() === 0) {
                this.player_switch.current.setState({ playing: true });
                this.getHowlerTimeline().play();
            }
            let str = this.progress_dot.current.style.transform;
            let x = parseInt(str.substring(0, str.indexOf(',')).replace(/[^\d.]/g, ''));
            let percentage = ((x) / this.progress_bg.current.clientWidth);
            let seek = Math.round(percentage * this.getHowlerTimeline().duration());
            // this.gsapTimelineSeek(seek);
            // this.state.howler.seek(seek);
            this.timelineSeek(seek);
            if (this.dragging) {
                this.dragging = false;
            }
        }

        this.handle_progress_click = (e) => {
            if (e.target.id === "progress_transparent" && this.getHowlerTimeline().playing()) {
                // if (! && _that.state.howler.seek() === 0) {
                //     _that.player_switch.current.setState({ playing: true });
                //     _that.state.howler.play();
                // }
                let seek = Math.round(e.nativeEvent.offsetX / Math.round(e.target.getBoundingClientRect().width) * this.getHowlerTimeline().duration());
                this.timelineSeek(seek);
                // this.gsapTimelineSeek(seek);
                // this.state.howler.seek(seek);
            }
        };
    }

    fmtMSS(s) {
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }

    gsapTimelineSeek(seek) {
        this.props.hgTimeline.gsapTimeline.seek(Math.round(seek));
    }

    howlerTimelineSeek(seek) {
        this.props.hgTimeline.howlerTimeline.seek(Math.round(seek));
    }

    timelineSeek(seek) {
        this.props.hgTimeline.gsapTimeline.seek(Math.round(seek));
        this.props.hgTimeline.howlerTimeline.seek(Math.round(seek));
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
            if (target.className === "progress_point" && _that.getHowlerTimeline().playing()) {
                let id = target.id.split('_')[2];
                _that.timelineSeek(_that.state.slide_map[id - 1].startTime);
                // _that.gsapTimelineSeek(_that.state.slide_map[id - 1].startTime);
                // _that.state.howler.seek(_that.state.slide_map[id - 1].startTime);
            }
        }

        for (let [index, value] of _that.state.slide_map.entries()) {
            if (index != 0) {
                let id = `progress_point_${value.page}`;
                let key = `progress_point_key_${index}`;
                let percentage = (value.startTime / _that.getHowlerTimeline().duration()).toFixed(2) * 100;
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

    getHowlerTimeline() {
        return this.props.hgTimeline.howlerTimeline;
    }

    getGSAPTimeline() {
        return this.props.hgTimeline.gsapTimeline;
    }
}

export default Progress;
