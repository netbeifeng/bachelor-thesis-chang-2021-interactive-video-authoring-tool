import React, { Component } from 'react';

class PlayRate extends Component {
    state = {
        visibility: 'hidden',
        playRateNumber: '1.0'
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (<div id="player_rate" ref={this.player_rate}>
            <i className="fas fa-tachometer-alt"></i>
            <span id="player_rate_text" > Rate: <label id="player_rate_number" ref={this.player_rate_number}>{this.state.playRateNumber}</label> </span>
            <div className="player_rate_selections" ref={this.player_rate_selections} onMouseEnter={this.handleMouseEnter.bind(this)} onMouseLeave={this.handleMouseLeave.bind(this)}>
                <div className="player_rate_selection" style={{ left: "-70px", width: "120px", visibility: this.state.visibility }} onClick={() => this.onClick(0.75)}>0.75</div>
                <div className="player_rate_selection" style={{ left: "60px", visibility: this.state.visibility }} onClick={() => this.onClick(1.0)}>1.0</div>
                <div className="player_rate_selection" style={{ left: "170px", width: "120px", visibility: this.state.visibility }} onClick={() => this.onClick(1.25)}>1.25</div>
                <div className="player_rate_selection" style={{ left: "300px", width: "120px", visibility: this.state.visibility }} onClick={() => this.onClick(1.5)}>1.5</div>
            </div>
        </div>);
    }

    handleMouseEnter() {
        if (this.state.visibility == 'hidden') {
            this.setState({
                visibility: 'visible'
            })
        }
    }

    handleMouseLeave() {
        this.setState({
            visibility: 'hidden'
        });
    }

    onClick(rate) {
        let howler = this.props.howler;
        let timeline = this.props.timeline;
        this.setState({
            playRateNumber: `${rate}`
        });
        howler.rate(rate);
        timeline.timeScale(rate);
        console.log('%c ---- TIMELINE RATE ADJUSTED TO:' + rate +' ----', 'color: #009fd4e3;');
        // ee.emit(EventEnum.HowlerRateEvent, new HowlerRateEvent(Date.now(), this, rate));
    }
}

export default PlayRate;