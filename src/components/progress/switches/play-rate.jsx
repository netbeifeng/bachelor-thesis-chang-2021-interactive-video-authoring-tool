import React, { Component, createRef, useRef } from 'react';
import EventEnum from '../../../enities/Event/EventEnum';
import HowlerRateEvent from '../../../enities/Event/HowlerRateEvent';

import ee from '../../../utilities/event-emitter';

class PlayRate extends Component {
    constructor(props) {
        super(props);

        this.player_rate = React.createRef("player_rate");
        this.player_rate_selections = React.createRef("player_rate_selections");
        this.player_rate_number = React.createRef("player_rate_number");
    }

    render() {
        return (<div id="player_rate" ref={this.player_rate}>
            <i className="fas fa-tachometer-alt"></i>
            <span id="player_rate_text" > Rate: <label id="player_rate_number" ref={this.player_rate_number}>1.0</label> </span>
            <div className="player_rate_selections" ref={this.player_rate_selections}></div>
        </div>);
    }

    componentDidMount() {
        let howler = this.props.howler;
        let selections = this.player_rate_selections.current;
        this.player_rate.current.onmouseenter = (e) => {
            let player_rate_selection_0_5 = document.createElement('div');
            player_rate_selection_0_5.className = "player_rate_selection";
            player_rate_selection_0_5.innerHTML = "0.75";
            player_rate_selection_0_5.style.left = "-70px";
            player_rate_selection_0_5.style.width = "120px";
            player_rate_selection_0_5.onclick = () => {
                this.player_rate_number.current.innerHTML = "0.75";
                howler.rate(0.75);
                ee.emit(EventEnum.HowlerRateEvent, new HowlerRateEvent(Date.now(), this, 0.75));
            }
            let player_rate_selection_1_0 = document.createElement('div');
            player_rate_selection_1_0.className = "player_rate_selection";
            player_rate_selection_1_0.innerHTML = "1.0";
            player_rate_selection_1_0.style.left = "60px";
            player_rate_selection_1_0.onclick = () => {
                this.player_rate_number.current.innerHTML = "1.0";
                howler.rate(1);
                ee.emit(EventEnum.HowlerRateEvent, new HowlerRateEvent(Date.now(), this, 1));
            }
            let player_rate_selection_1_5 = document.createElement('div');
            player_rate_selection_1_5.className = "player_rate_selection";
            player_rate_selection_1_5.innerHTML = "1.25";
            player_rate_selection_1_5.style.left = "170px";
            player_rate_selection_1_5.style.width = "120px";
            player_rate_selection_1_5.onclick = () => {
                this.player_rate_number.current.innerHTML = "1.25";
                howler.rate(1.25);
                ee.emit(EventEnum.HowlerRateEvent, new HowlerRateEvent(Date.now(), this, 1.25));
            }
            let player_rate_selection_2_0 = document.createElement('div');
            player_rate_selection_2_0.className = "player_rate_selection";
            player_rate_selection_2_0.innerHTML = "1.5";
            player_rate_selection_2_0.style.left = "300px";
            player_rate_selection_2_0.onclick = () => {
                this.player_rate_number.current.innerHTML = "1.5";
                howler.rate(1.5);
                ee.emit(EventEnum.HowlerRateEvent, new HowlerRateEvent(Date.now(), this, 1.5));
            }
            if (selections.children.length == 0) {
                selections.appendChild(player_rate_selection_0_5);
                selections.appendChild(player_rate_selection_1_0);
                selections.appendChild(player_rate_selection_1_5);
                selections.appendChild(player_rate_selection_2_0);
            }
        }

        this.player_rate.current.onmouseleave = () => {
            if(selections.children.length > 0) {
                selections.innerHTML = "";
            }
        }

    }
}

export default PlayRate;