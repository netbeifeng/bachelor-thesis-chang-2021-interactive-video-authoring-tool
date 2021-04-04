import Element from "./Element";
import Position from "./Position";

class Image extends Element {
    iid: number;
    isOnline: boolean;
    path: string;
    width: number;
    height: number;

    constructor(iid: number, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number, path: string, isOnline: boolean) {
        super(startTime, duration, positionX, positionY);
        this.iid = iid;
        this.path = path;
        this.isOnline = isOnline;
        this.width = width;
        this.height = height;
    }
}

export default Image;