import React, { Component, createRef, useRef } from 'react';
import './progress.scss';

import PlaySwitch from './switches/play-switch';
import ClosedCaptionSwitch from './switches/cc-switch';
import VolumeSwitch from './switches/volume-switch';

import Draggable from 'react-draggable';

import { Howl, Howler } from 'howler';
import ee from '../../utilities/event-emitter';

import EventEnum from '../../enities/Event/EventEnum';
import Render from '../../utilities/render/Render';
import { gsap, TweenMax } from "gsap";


class Progress extends Component {

    constructor(props) {
        super(props);
        this.ilvRender = new Render();


        this.state = {
            seek: 0,
            howler: new Howl({
                src: [`assets/audio/${this.ilvRender.getILV().audio}`],
                volume: 0.5
            }),
            // playIndex: 0,
            disabled: true,
            playing: false,
            slide_point: [],
            slide_map: this.ilvRender.getILV().getSlides()
        }
        this.ee = ee;

        this.dragging = false;

        this.progress = React.createRef("progress");
        this.progress_text = React.createRef("progress_text");
        this.progress_dot = React.createRef("progress_dot");
        this.progress_bg = React.createRef("progress_bg");
        this.player_switch = React.createRef("play_switch");

        // this.playlist = [scene_1, scene_2];
    }

    render() {
        return (
            <div id="progress_container">
                <div id="progress_bar">
                    <div id="switches">
                        <PlaySwitch howler={this.state.howler} playing={this.state.playing} disabled={this.state.disabled} ref={this.player_switch} />
                        <ClosedCaptionSwitch howler={this.state.howler} playIndex={this.state.playIndex} />
                        <VolumeSwitch howler={this.state.howler} />
                    </div>

                    <div id="progress_text" ref={this.progress_text}>
                        <span>-  📼</span>&nbsp;-
                        {/* <img src={loading} width={30} height={30} /> */}
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
                    <div id="progress" ref={this.progress}></div>
                </div>
            </div>
        );
    }



    initPage() {
        document.getElementsByClassName('main')[0].appendChild(this.ilvRender.getContentNaviHTML(this.state.howler));
        for (let span of document.getElementsByClassName('content_item')) {
            span.addEventListener('click', () => {
                this.state.howler.seek(Number(span.dataset.startTime));
                this.howlerSeek(Number(span.dataset.startTime));
            })
        }
        console.log('%c ---- PAINTING I-Layer ----', 'color: forestgreen;');
        for (let animation of this.ilvRender.getILV().getAnimations()) {
            animation.paint();
        }
        console.log('%c ---- I-Layer PREPARED ----', 'color: forestgreen;');
        this.setUpQuizListner();
        console.log('%c ---- Listner PREPARED ----', 'color: blue;');
    }

    howlerSeek(seek) {
        this.timeline.seek(Math.round(seek));
    }

    componentDidMount() {
        let _that = this;
        _that.initPage();

        ee.on(EventEnum.HowlerPauseEvent, () => {
            this.timeline.pause();
            console.log('%c ---- TIMELINE PAUSE ----', 'color: darkorange;');

        });

        ee.on(EventEnum.HowlerResumeEvent, () => {
            this.timeline.resume();
            console.log('%c ---- TIMELINE RESUME ----', 'color: darkorange;');
        });



        // ee.on(EventEnum.HowlerSeekEvent, (e) => {

        // });
        // _that.ee.on(EventEnum.PIXIStageInitEvent, () => {
        //     _that.state.howler.unload();
        //     _that.setState({
        //         howler: new Howl({
        //             src: ['/sound.ogg'],
        //             volume: 0.5
        //         }),
        //         playIndex: 0,
        //         playing: false,
        //         disabled: true,
        //         emphasis_points: [],
        //         powerpoint_maps: []
        //     });
        //     _that.progress.current.style.width = '0px';
        //     _that.progress_dot.current.style.left = '-15px';
        //     _that.progress_dot.current.style.transform = '';

        // });

        // _that.ee.on(EventEnum.PIXISceneChangeEvent, (e) => {
        //     let scene = e.getScene();
        //     if (scene >= 1) {
        //         _that.state.howler.unload();
        //         _that.setState({
        //             howler: new Howl({
        //                 src: [this.playlist[scene - 1]],
        //                 volume: 0.5,
        //             }),
        //             playIndex: scene,
        //             disabled: false,
        //             playing: true
        //         });
        //         this.state.powerpoint_maps = new PowerPointStory().initimate(scene).getPowerPointMap();

        //         ee.emit(EventEnum.PIXISceneChangeEvent, new PIXISceneChangeEvent(Date.now(), this, -1));

        _that.state.howler.on('load', function () {
            _that.progress_text.current.innerHTML = "0:00 / " + _that.fmtMSS(~~_that.state.howler.duration());
            _that.timeline = _that.ilvRender.getTimeline();
            _that.timeline.pause();
            console.log(_that.timeline);
            _that.ee.emit(EventEnum.HowlerLoadEvent, { howler: _that.state.howler });
            _that.state.duration = _that.state.howler.duration();

            // ee.emit(EventEnum.PIXISceneChangeVarEvent, new PIXISceneChangeVarEvent(Date.now(), this, scene, _that.state.howler));
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
                if (target.className === "progress_point") {
                    let id = target.id.split('_')[2];
                    if (!_that.state.howler.playing()) {
                        _that.state.howler.play();
                        let element = document.getElementById("player_switch");
                        element.firstChild.className = "fas fa-pause";
                        element.lastChild.innerHTML = " Pause ";
                        element.style.backgroundColor = "rgba(15, 114, 228, 0.9)";
                    }
                    _that.howlerSeek(_that.state.slide_map[id - 1].startTime);
                    // ee.emit(EventEnum.HowlerSeekEvent, new HowlerSeekEvent(Date.now(), this, _that.state.slide_map[id - 1].startTime));
                    _that.state.howler.seek(_that.state.slide_map[id - 1].startTime);
                }
            }

            for (let [index, value] of _that.state.slide_map.entries()) {
                if (index != 0) {
                    let id = `progress_point_${value.page}`;
                    let key = `progress_point_key_${index}`;
                    let percentage = (value.startTime / _that.state.howler.duration()).toFixed(2) * 100;
                    let style = {
                        marginLeft: `${percentage}%`
                    }
                    array.push(<span className="progress_point" id={id} key={key} style={style} onClick={handle_onMouseClick} onMouseEnter={handle_onMouseEnter} onMouseLeave={handle_onMouseLeave}></ span>);
                }
            }

            _that.setState({
                slide_point: array,
            })
        });

        _that.state.howler.on('play', function () {
            window.requestAnimationFrame(step);
        })

        function step() {
            // recursive call
            let howler = _that.state.howler;
            let seek = howler.seek() || 0;
            let duration = howler.duration();

            // _that.ee.emit("howler_seek", { seek: seek });

            if (howler.playing()) {
                window.requestAnimationFrame(step);
                _that.progress_text.current.innerHTML = (_that.fmtMSS(~~seek) + " / " + _that.fmtMSS(~~duration));
                if (Math.abs(seek - duration) <= 0.5) {
                    _that.progress.current.style.width = '80%';
                    _that.progress_dot.current.style.left = _that.progress_dot.current.parentNode.width - 15 + 'px';
                } else if (seek != 0 && !_that.dragging) {
                    _that.progress.current.style.width = (seek / duration) * 80 + '%';
                    _that.progress_dot.current.setAttribute('style', `transform: translate(${((seek / duration) * (_that.progress_dot.current.parentNode.clientWidth)).toFixed(2)}px, -10px)`)
                }
            }
        }

        _that.handle_mouse_move = (e) => {
            if (e.target.id == 'progress_transparent') {
                // console.log(e.screenX, e.target.offsetLeft + e.target.offsetWidth);
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

        _that.handle_mouse_leave = (e) => {
            if (e.target.id == 'progress_transparent') {
                e.target.removeChild(document.getElementById('progress_time_tip'));
            }
        }

        _that.handleStart = () => {
            _that.dragging = true;
        }

        _that.handleDrag = () => {
            let str = _that.progress_dot.current.style.transform;
            let x = parseInt(str.substring(0, str.indexOf(',')).replace(/[^\d.]/g, ''));
            // console.log(str,x);
            let percentage = ((x) / _that.progress_bg.current.clientWidth);
            _that.howlerSeek(Math.round(percentage * _that.state.howler.duration()));

            // ee.emit(EventEnum.HowlerSeekEvent, new HowlerSeekEvent(Date.now(), this, Math.round(percentage * _that.state.howler.duration())));
            _that.progress.current.style.width = `${percentage * 80}%`;
        }

        _that.handleStop = () => {
            if (!_that.state.howler.playing() && _that.state.howler.seek() === 0) {
                _that.player_switch.current.setState({ playing: true });
                _that.state.howler.play();
            }
            let str = _that.progress_dot.current.style.transform;
            let x = parseInt(str.substring(0, str.indexOf(',')).replace(/[^\d.]/g, ''));
            let percentage = ((x) / _that.progress_bg.current.clientWidth);
            let seek = Math.round(percentage * _that.state.howler.duration());
            _that.howlerSeek(seek);

            // ee.emit(EventEnum.HowlerSeekEvent, new HowlerSeekEvent(Date.now(), this, seek));
            _that.state.howler.seek(seek);
            if (_that.dragging) {
                _that.dragging = false;
            }
        }

        _that.handle_progress_click = (e) => {
            if (e.target.id === "progress_transparent") {
                if (!_that.state.howler.playing() && _that.state.howler.seek() === 0) {
                    _that.player_switch.current.setState({ playing: true });
                    _that.state.howler.play();
                }
                let seek = Math.round(e.nativeEvent.offsetX / Math.round(e.target.getBoundingClientRect().width) * _that.state.howler.duration());
                _that.howlerSeek(seek);
                // ee.emit(EventEnum.HowlerSeekEvent, new HowlerSeekEvent(Date.now(), this, seek));
                _that.state.howler.seek(seek);
            }
        };
    }

    fmtMSS(s) {
        return (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    }

    setUpQuizListner() {
        if (document.getElementsByClassName('quizComponent').length > 0) {
            for (let option of document.getElementsByClassName('questionOption')) {
                option.addEventListener('click', () => {
                    let quizComponent = option.parentElement.parentElement.parentElement;
                    let questionFeedback = option.parentElement.parentElement.getElementsByClassName('questionFeedback')[0];
                    let questionTip = option.parentElement.parentElement.getElementsByClassName('questionTip')[0];
                    if (option.dataset.correct == 'true') {
                        option.className = "questionOption_right";
                        questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/check_mark.png' />
                        <label class='feedbackContent'>Richtig :) </label>`;
                        questionFeedback.style.color = "forestgreen";
                    } else {
                        option.className = "questionOption_wrong";
                        questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/cross_mark.png' />
                        <label class='feedbackContent'>Falsch :( </label>`;
                        questionFeedback.style.color = "firebrick";
                    }
                    if (!quizComponent.dataset.isSelected) {
                        TweenMax.to(quizComponent, {
                            height: quizComponent.clientHeight * 1.6, duration: 2, onComplete: () => {
                                TweenMax.to(questionTip, { opacity: 1, visibility: 'visible', duration: 1 });
                                TweenMax.to(questionFeedback, { opacity: 1, visibility: 'visible', duration: 1 });
                            }
                        });
                    }
                    quizComponent.dataset.isSelected = true;
                });
            }
        }
    }
}

export default Progress;
