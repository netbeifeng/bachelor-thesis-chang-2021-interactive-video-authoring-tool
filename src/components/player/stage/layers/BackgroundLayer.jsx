import React, { Component } from 'react';
import logo from '../../../../assets/public_imgs/logo.png';

class BackgroundLayer extends Component {

    constructor(props) {
        super(props);
        this.footer = this.props.ILV.ILVObject.getFooter();
    }

    render() {
        return (
            <div id='htmlBackgroundLayer' style={{ zIndex: 0 }}>
                <div id='backgroundBottom'>
                    <img id='backgroundLogo' src={logo}/>
                    <div id='backgroundLine' />
                    <div id='backgroundInfo'>
                        <span id='backgroundInstitution'>{this.footer.intitution}</span>
                        <span id='backgroundCourseInfo1'>{this.footer.info1}</span>
                        <span id='backgroundCourseInfo2'>{this.footer.info2}</span>
                        <span id='backgroundLecturer'>{this.footer.lecturer}</span>
                        <span id='backgroundPage'>{'Seite ' + this.props.ILV.ILVObject.getSlidePagebyTime(this.props.ILV.ILVPlayer.currentTiming)}</span>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {

    }
}

export default BackgroundLayer;
