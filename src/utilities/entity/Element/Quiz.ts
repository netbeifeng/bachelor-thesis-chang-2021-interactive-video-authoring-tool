import Element from "./Element";
import { gsap } from 'gsap';
class Quiz extends Element {
    qid: number;
    width: number;
    height: number;
    questionContent: string;
    correctAnswer: string;
    wrongAnswers: Array<string> = new Array<string>();
    tip: string;


    constructor(qid: number, questionContent: string, correctAnswer: string, wrongAnswers: Array<string>, tip: string, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.qid = qid;
        this.wrongAnswers = wrongAnswers;
        this.questionContent = questionContent;
        this.correctAnswer = correctAnswer;
        this.tip = tip;
        this.width = width;
        this.height = height;
    }

    getID(): string {
        return `QID_${this.qid}`;
    }

    getHTMLElement(): HTMLElement {
        var quizDivElement = document.createElement('div');

        quizDivElement.className = "quizComponent";
        quizDivElement.dataset.isSelected = "false";
        if (this.width && this.height) {
            quizDivElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px; width: ${this.width}px; height: ${this.height}px; z-index: ${this.zIndex};`);
        } else {
            quizDivElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px; z-index: ${this.zIndex};`);
        }
        quizDivElement.id = `QID_${this.qid}`;

        let questionRow = document.createElement('div');
        questionRow.className = 'questionRow';
        questionRow.innerHTML = `<span>
            <img class='quizIcon' src='public_imgs/question.png' />
        </span>
        <span class='questionContent'>${this.questionContent}</span>`;
        let questionOptionBlock = document.createElement('div');
        questionOptionBlock.className = 'questionOptionBlock';
        let answers = [];
        for (let answer of this.wrongAnswers) {
            answers.push({
                isCorrect: false,
                content: answer
            });
        }

        let correctAnswer = this.correctAnswer;
        answers.push({
            isCorrect: true,
            content: correctAnswer
        });

        const shuffleArray = (array) => {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        shuffleArray(answers);
        var questionFeedback = document.createElement('div');
        questionFeedback.style.visibility = 'hidden';
        questionFeedback.style.opacity = '0';
        questionFeedback.className = 'questionFeedback';
        questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/cross_mark.png' />
        <label class='feedbackContent'>Falsch :( </label>`;

        var questionTip = document.createElement('div');
        questionTip.className = 'questionTip';
        questionTip.style.visibility = 'hidden';
        questionTip.style.opacity = '0';
        questionTip.innerHTML = `<span>
            <img class='quizIcon' src='public_imgs/info.png' />
        </span>
        <span class='questionTipContent'>${this.tip}</span>`;

        for (let [index, item] of answers.entries()) {
            let questionOption = document.createElement('div');
            questionOption.className = "questionOption";
            questionOption.id = `QID_${this.qid}_Option_${index}`;
            questionOption.dataset.correct = `${item.isCorrect}`;

            let optionContainer = document.createElement('div');
            optionContainer.className = "optionContainer";

            let optionNo = document.createElement('span');
            optionNo.className = "optionNo";
            optionNo.innerHTML = `${String.fromCharCode(index + 65)}.&nbsp;`;

            let optionContent = document.createElement('span');
            optionContent.className = "optionContent";
            optionContent.innerHTML = `${item.content}`;

            optionContainer.appendChild(optionNo);
            optionContainer.appendChild(optionContent);
            questionOption.appendChild(optionContainer);
            questionOption.onclick = () => {
                // console.log(questionOption);
                if (questionOption.dataset.correct == 'true') {
                    questionOption.className = "questionOption_right";
                    questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/check_mark.png' />
                        <label class='feedbackContent'>Richtig :) </label>`;
                    questionFeedback.style.color = "forestgreen";
                } else {
                    questionOption.className = "questionOption_wrong";
                    questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/cross_mark.png' />
                        <label class='feedbackContent'>Falsch :( </label>`;
                    questionFeedback.style.color = "firebrick";
                }
                if (quizDivElement.dataset.isSelected == "false") {
                    gsap.to(quizDivElement, {
                        height: quizDivElement.clientHeight * 1.6, duration: 2, onComplete: () => {
                            gsap.to(questionTip, { opacity: 1, visibility: 'visible', duration: 1 });
                            gsap.to(questionFeedback, { opacity: 1, visibility: 'visible', duration: 1 });
                        }
                    });
                }
                quizDivElement.dataset.isSelected = "true";
            }
            questionOptionBlock.appendChild(questionOption);
            // questionOptionBlock.innerHTML += `<div class='questionOption' data-correct=${item.isCorrect} id='QID_${this.qid}_Option_${index}'>
            //     <div class='optionContainer'>
            //         <span class='optionNo'>${String.fromCharCode(index + 65)}.&nbsp;</span>
            //         <span class='optionContent'>${item.content}</span>
            //     </div>
            // </div>`;
        }



        questionRow.appendChild(questionOptionBlock);
        questionRow.appendChild(questionFeedback);
        questionRow.appendChild(questionTip);

        quizDivElement.appendChild(questionRow);
        quizDivElement.style.opacity = '0';
        quizDivElement.style.visibility = 'hidden';

        return quizDivElement;
    }

    setUpQuizListner() {
        if (document.getElementById(`QID_${this.qid}`)) {
            let quizComponent = document.getElementById(`QID_${this.qid}`);
            for (let option of quizComponent.getElementsByClassName('questionOption')) {
                console.log(option);

                // option.addEventListener('click', () => {
                //     let quizComponent = option.parentElement.parentElement.parentElement;
                //     let questionFeedback = <HTMLDivElement> option.parentElement.parentElement.getElementsByClassName('questionFeedback')[0];
                //     let questionTip = option.parentElement.parentElement.getElementsByClassName('questionTip')[0];
                //     if (option.dataset.correct == 'true') {
                //         option.className = "questionOption_right";
                //         questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/check_mark.png' />
                //         <label class='feedbackContent'>Richtig :) </label>`;
                //         questionFeedback.style.color = "forestgreen";
                //     } else {
                //         option.className = "questionOption_wrong";
                //         questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/cross_mark.png' />
                //         <label class='feedbackContent'>Falsch :( </label>`;
                //         questionFeedback.style.color = "firebrick";
                //     }
                //     if (!quizComponent.dataset.isSelected) {
                //         gsap.to(quizComponent, {
                //             height: quizComponent.clientHeight * 1.6, duration: 2, onComplete: () => {
                //                 gsap.to(questionTip, { opacity: 1, visibility: 'visible', duration: 1 });
                //                 gsap.to(questionFeedback, { opacity: 1, visibility: 'visible', duration: 1 });
                //             }
                //         });
                //     }
                //     quizComponent.dataset.isSelected = true;
                // });
            }
        }
    }
}

export default Quiz;