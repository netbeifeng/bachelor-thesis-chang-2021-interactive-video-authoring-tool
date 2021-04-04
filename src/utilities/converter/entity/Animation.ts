import Element from "./Element";
import Position from "./Position";

class Animation extends Element {
    aid: number;
    startTime: number;
    duration: number;
    position: Position;

    constructor(aid: number, content: string, startTime: number, duration: number, positionX: number, positionY: number) {
        super(startTime, duration, positionX, positionY);
        this.aid = aid;
    }
}

export default Animation;