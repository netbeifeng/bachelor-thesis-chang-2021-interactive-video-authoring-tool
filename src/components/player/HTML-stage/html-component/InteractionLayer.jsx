import React, { Component, useRef } from 'react';
// import _default from '../../../../../node_modules/highlight.js/scss/default.scss';

class InteractionLayer extends Component {

    constructor(props) {
        super(props);
        // this.converter = new Converter()
    }

    render() {
        return (
            <div id='htmlInteractionLayer' style={{ zIndex: 1 }}>
                <div id='cursor'/>
                {/* <h1 className='slideTitle' style={{ left: '90px', top: '85px' }}>Digitale Grauwertbilder</h1> */}
                {/* <div className='quizComponent' style={{ left: '200px', top: '500px', width: '500px', height: '500px' }}>
                    <div className='questionRow'>
                        <span>
                            <img className='quizIcon' src='public_imgs/question.png' />
                        </span>
                        <span className='questionContent'>What is this?</span>

                        <div className='questionOptionBlock'>
                            <div className='questionOption'>
                                <div className='optionContainer'>
                                    <span className='optionNo'>A.&nbsp;</span>
                                    <span className='optionContent'>ABCABC</span>
                                </div>
                            </div>
                            <div className='questionOption'>
                                <div className='optionContainer'>
                                    <span className='optionNo'>B.&nbsp;</span>
                                    <span className='optionContent'>ABCABC</span>
                                </div>
                            </div>
                            <div className='questionOption'>
                                <div className='optionContainer'>
                                    <span className='optionNo'>C.&nbsp;</span>
                                    <span className='optionContent'>ABCABC</span>
                                </div>
                            </div>
                            <div className='questionOption'>
                                <div className='optionContainer'>
                                    <span className='optionNo'>D.&nbsp;</span>
                                    <span className='optionContent'>ABCABC</span>
                                </div>
                            </div>

                        </div>
                        <div className="questionFeedback">
                            <img className='feedbackIcon' src='public_imgs/cross_mark.png' />
                            <label className='feedbackContent'>Falsch :( </label>
                        </div>
                        <div className="questionTip">
                            <span>
                                <img className='quizIcon' src='public_imgs/info.png' />
                            </span>
                            <span className='questionTipContent'>What isXXXXXXXX this?</span>
                        </div>
                    </div>
                </div>
                <script>

                </script> */}
            </div>
        );
    }

    componentDidMount() {
    }

    
}

export default InteractionLayer;
