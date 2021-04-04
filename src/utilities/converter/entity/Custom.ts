import Element from "./Element";
import Position from "./Position";

class Custom extends Element {
    cid: number;
    path: string;
    htmlContent: string;

    constructor(cid: number, path: string, htmlContent: string, startTime: number, duration: number, positionX: number, positionY: number) {
        super(startTime, duration, positionX, positionY);
        this.cid = cid;
        this.path = path;
        this.htmlContent = htmlContent;
    }
}

export default Custom;