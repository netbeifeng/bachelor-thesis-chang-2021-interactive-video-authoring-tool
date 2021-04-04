import React, { Component, useRef } from 'react';
import bg from "../../../../assests/demo_1/powerpoint_1.png";
import Converter from '../../../../utilities/converter/Converter';

class BackgroundLayer extends Component {

    constructor(props) {
        super(props);
        this.footer = new Converter().getFooter();
    }

    render() {
        return (
            <div id='htmlBackgroundLayer' style={{zIndex: 0}}>
                {/* <img id='backgroundImg'/> */}
                <div id='backgroundBottom'>
                    <div id='backgroundLine'/>
                    <div id='backgroundInfo'>
                        <span id='backgroundInstitution'>{this.footer.intitution}</span>
                        <span id='backgroundCourseInfo1'>{this.footer.info1}</span>
                        <span id='backgroundCourseInfo2'>{this.footer.info2}</span>
                        <span id='backgroundLecturer'>{this.footer.lecturer}</span>
                        <span id='backgroundPage'>{this.footer.page}</span>
                    </div>
                </div>
            </div>
        );
    }

    componentDidMount() {

    }
}

export default BackgroundLayer;
