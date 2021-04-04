

import React, { Component, useRef } from 'react';
import { TweenMax, Power2 } from 'gsap/all';
import ee from '../../../utilities/event-emitter';
import EventEnum from '../../../enities/Event/EventEnum';
import ThreeResizeEvent from '../../../enities/Event/ThreeResizeEvent';

class ThreeContainerControl extends Component {

    constructor(props) {
        super(props);
        this.transformContainer = '';
        this.ee = ee;
        this.minimizeOnClick = () => {
            let container = document.getElementById('three-container');
            let playerContainer = document.getElementById('three-player');
            let control = document.getElementById('three-window-control');
            let expand = document.getElementById('three-window-expand');
            let stats = document.getElementById('stats-container');
            let gui = document.getElementById('gui-container');
            this.transformContainer = container.style.transform;
            TweenMax.to(control, { duration: 1, opacity: 0, display: 'none' });
            TweenMax.to(stats, { duration: 1, opacity: 0, display: 'none' });
            TweenMax.to(gui, { duration: 1, opacity: 0, display: 'none' });
            TweenMax.to(container, {
                duration: 1, width: '80px', height: '80px', borderRadius: '40px', transform: '', ease: Power2.easeOut, delay: .5, onComplete: () => {
                    TweenMax.to(playerContainer, { duration: .5, opacity: 0, display: 'none' });
                    TweenMax.to(expand, { duration: .5, opacity: 1, display: '', delay: .3 });
                }
            });
        }

        this.expandOnClick = () => {
            let container = document.getElementById('three-container');
            let playerContainer = document.getElementById('three-player');
            let control = document.getElementById('three-window-control');
            let expand = document.getElementById('three-window-expand');
            let stats = document.getElementById('stats-container');
            let gui = document.getElementById('gui-container');
            TweenMax.to(container, { duration: .5, width: '50%', height: '60%', borderRadius: '20px', transform: this.transformContainer, ease: Power2.easeIn });
            TweenMax.to(expand, {
                duration: .5, opacity: 0, display: 'none', onComplete: () => {
                    TweenMax.to(playerContainer, { duration: .5, opacity: 1, display: '' });
                    TweenMax.to(stats, { duration: 1, opacity: 1, display: '' });
                    TweenMax.to(gui, { duration: 1, opacity: 1, display: '' });
                    TweenMax.to(control, { duration: .5, opacity: 1, display: '', delay: .3 });
                }
            });
        }

        this.expandFullScreenOnClick = () => {
            let container = document.getElementById('three-container');
            let handle = document.getElementById('three-window-handle');
            let expandIcon = document.getElementsByClassName('fa-expand-alt')[0];
            let minimizeIcon = document.getElementsByClassName('fa-window-minimize')[0];
            let compressIcon = document.getElementsByClassName('fa-compress-alt')[0];
            this.transformContainer = container.style.transform;
            // console.log(this.transformContainer);
            TweenMax.to(container, { duration: .5, width: '100%', height: '100%', bottom: '0', right: '0', transform: 'translate(0px,0px)', ease: Power2.easeIn });
            TweenMax.to(handle, { duration: .5, opacity: 0, display: 'none' });
            TweenMax.to(expandIcon, {
                duration: .5, opacity: 0, display: 'none', onUpdate: () => {
                    this.ee.emit(EventEnum.ThreeResizeEvent, new ThreeResizeEvent(Date.now(), this));
                }, onComplete: () => {
                    TweenMax.to(minimizeIcon, { duration: .5, opacity: 0, display: 'none' });
                    TweenMax.to(compressIcon, { duration: .5, opacity: 1, top: '92%', left: '95%', display: '', delay: .5 });
                }
            });
        }

        this.compressFullScreenOnClick = () => {
            let container = document.getElementById('three-container');
            let handle = document.getElementById('three-window-handle');
            let expandIcon = document.getElementsByClassName('fa-expand-alt')[0];
            let minimizeIcon = document.getElementsByClassName('fa-window-minimize')[0];
            let compressIcon = document.getElementsByClassName('fa-compress-alt')[0];
            // container.style.transform = this.transformContainer;
            // console.log(this.transformContainer);
            TweenMax.to(container, { duration: .5, width: '50%', height: '60%', bottom: '5%', right: '2.5%', transform: this.transformContainer, ease: Power2.easeIn });
            TweenMax.to(handle, { duration: .5, opacity: 1, display: '' });
            TweenMax.to(compressIcon, {
                duration: .5, opacity: 0, display: 'none', onUpdate: () => {
                    this.ee.emit(EventEnum.ThreeResizeEvent, new ThreeResizeEvent(Date.now(), this));
                }, onComplete: () => {
                    TweenMax.to(minimizeIcon, { duration: .5, opacity: 1, display: '' });
                    TweenMax.to(expandIcon, { duration: .5, opacity: 1, display: '', delay: .5 });
                }
            });
        }
    }

    render() {
        return (
            <>
                <div id="three-window-control">
                    <div id="three-window-handle">
                        {/* <i class="fas fa-arrows-alt"></i> */}
                    </div>
                    <i className="fas fa-window-minimize" onClick={this.minimizeOnClick}></i>
                    <i className="fas fa-expand-alt" onClick={this.expandFullScreenOnClick}></i>
                    <i className="fas fa-compress-alt" style={{ display: 'none', opacity: 0 }} onClick={this.compressFullScreenOnClick}></i>
                </div>
                <div id="three-window-expand" style={{ display: 'none', opacity: 0 }} onClick={this.expandOnClick}>
                    <i className="fas fa-expand-arrows-alt"></i>
                </div>
            </>
        );
    }

    componentDidMount() {
        // this.initScene(useApp().stage);

    }
}

export default ThreeContainerControl;
