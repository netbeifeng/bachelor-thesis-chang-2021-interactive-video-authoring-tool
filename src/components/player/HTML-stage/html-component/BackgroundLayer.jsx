import React, { Component } from 'react';


class BackgroundLayer extends Component {

    constructor(props) {
        super(props);
        this.footer = this.props.ILV.getFooter();
    }

    render() {
        return (
            <div id='htmlBackgroundLayer' style={{zIndex: 0}}>
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
