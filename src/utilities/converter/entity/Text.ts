import Element from "./Element";
import Position from "./Position";

class Text extends Element {
    tid: number;
    content: string;
    fontSize: number = 26;
    fontColor: string = '#000000';
    fontFamily: string = 'Arial, Helvetica, sans-serif';

    constructor(tid: number, content: string, startTime: number, duration: number, positionX: number, positionY: number, fontSize: number, fontColor: string, fontFamily: string) {
        super(startTime, duration, positionX, positionY);
        this.startTime = startTime;
        this.tid = tid;
        this.content = content;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
        this.fontFamily = fontFamily;
    }

}

export default Text;