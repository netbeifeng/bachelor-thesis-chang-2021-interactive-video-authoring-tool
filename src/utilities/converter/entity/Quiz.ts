import Element from "./Element";
import Position from "./Position";

class Quiz extends Element {
    qid: number;
    startTime: number;
    duration: number;
    position: Position;
    width: number;
    height: number;
    questionContent: string;
    correctAnswer: string;
    wrongAnswers: Array<string>;
    tip: string;


    constructor(qid: number, questionContent: string, correctAnswer: string, wrongAnswers: Array<string>, tip: string, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number) {
        super(startTime, duration, positionX, positionY);
        this.qid = qid;
        this.questionContent = questionContent;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswers;
        this.tip = tip;
        this.width = width;
        this.height = height;
    }
}

export default Quiz;