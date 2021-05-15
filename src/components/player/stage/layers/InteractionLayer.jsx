import React, { Component } from 'react';
import { gsap } from 'gsap';

class InteractionLayer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='htmlInteractionLayer' style={{ zIndex: 1 }}>
                <div id='cursor' />
            </div>
        );
    }

    componentDidMount() {
        console.log('%c ---- PAINTING I-Layer ----', 'color: forestgreen;');
        this.paintElements();
        console.log('%c ---- I-Layer PREPARED ----', 'color: forestgreen;');

        console.log('%c ---- BUILDING TIMELINE ----', 'color: hotpink;');
        this.buildTimeline();
        console.log('%c ---- TIMELINE BUILT ----', 'color: hotpink;');

        this.setUpQuizListner();
        console.log('%c ---- Listner PREPARED ----', 'color: blue;');
    }

    paintElements() {
        for (let slide of this.props.ILV.ILVObject.getSlides()) {
            for (let element of slide.getElements()) {
                element.paint();
            }
        }
    }

    buildTimeline() {
        this.props.ILV.ILVTimeline.gsapTimeline.addLabel("start", 0);
        for (let animation of this.props.ILV.ILVObject.getAnimations()) {
            animation.animate(this.props.ILV.ILVTimeline.gsapTimeline);
        }
        this.props.ILV.ILVTimeline.gsapTimeline.pause();
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
                        gsap.to(quizComponent, {
                            height: quizComponent.clientHeight * 1.6, duration: 2, onComplete: () => {
                                gsap.to(questionTip, { opacity: 1, visibility: 'visible', duration: 1 });
                                gsap.to(questionFeedback, { opacity: 1, visibility: 'visible', duration: 1 });
                            }
                        });
                    }
                    quizComponent.dataset.isSelected = true;
                });
            }
        }
    }

}

export default InteractionLayer;
