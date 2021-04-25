import Element from "./Element";

class Quiz extends Element {
    qid: number;
    type: string;
    width: number;
    height: number;
    questionContent: string;
    correctAnswer: string;
    wrongAnswers: Array<string> = new Array<string>();
    tip: string;


    constructor(qid: number, type: string, questionContent: string, correctAnswer: string, wrongAnswers: Array<string>, tip: string, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.qid = qid;
        this.type = type;
        if (type == "MC") {
            this.wrongAnswers = wrongAnswers;
        } else {
            if (correctAnswer.toLocaleLowerCase() == 'true') {
                this.wrongAnswers.push('False');
            } else {
                this.wrongAnswers.push('True');
            }
        }
        this.questionContent = questionContent;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswers;
        this.tip = tip;
        this.width = width;
        this.height = height;
    }

    getID(): string {
        return `QID_${this.qid}`;
    }

    getHTMLElement(): HTMLElement {
        let quizDivElement = document.createElement('div');
        quizDivElement.className = "quizComponent";
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
        if (this.type == "MC") {
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
        } else if (this.type == "TF") {
            let correctAnswer = this.correctAnswer;
            answers.push({
                isCorrect: true,
                content: correctAnswer
            });
            if (correctAnswer.toLocaleLowerCase() == 'true') {
                answers.push({
                    isCorrect: false,
                    content: 'False'
                });
            } else {
                answers.push({
                    isCorrect: false,
                    content: 'Ture'
                });
            }
        }

        const shuffleArray = (array) => {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

        shuffleArray(answers);

        for (let [index, item] of answers.entries()) {
            questionOptionBlock.innerHTML += `<div class='questionOption' data-correct=${item.isCorrect} id='QID_${this.qid}_Option_${index}'>
                <div class='optionContainer'>
                    <span class='optionNo'>${String.fromCharCode(index + 65)}.&nbsp;</span>
                    <span class='optionContent'>${item.content}</span>
                </div>
            </div>`;
        }

        let questionFeedback = document.createElement('div');
        questionFeedback.style.visibility = 'hidden';
        questionFeedback.style.opacity = '0';
        questionFeedback.className = 'questionFeedback';
        questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/cross_mark.png' />
        <label class='feedbackContent'>Falsch :( </label>`;

        let questionTip = document.createElement('div');
        questionTip.className = 'questionTip';
        questionTip.style.visibility = 'hidden';
        questionTip.style.opacity = '0';
        questionTip.innerHTML = `<span>
            <img class='quizIcon' src='public_imgs/info.png' />
        </span>
        <span class='questionTipContent'>${this.tip}</span>`;

        questionRow.appendChild(questionOptionBlock);
        questionRow.appendChild(questionFeedback);
        questionRow.appendChild(questionTip);

        quizDivElement.appendChild(questionRow);
        quizDivElement.style.opacity = '0';
        quizDivElement.style.visibility = 'hidden';
        // let quizScript = document.createElement('script');
        // quizScript.innerText = `
        //     // $('.questionOption').click(()=>{
        //     //     console.log('AAA');
        //     // });
        // `;
        // quizDivElement.appendChild(quizScript);

        return quizDivElement;
    }
}

export default Quiz;