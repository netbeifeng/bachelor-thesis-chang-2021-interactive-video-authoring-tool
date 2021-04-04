import Element from "./Element";
import Position from "./Position";

class Video extends Element {
    vid: number;
    path: string;
    width: number;
    height: number;
    isOnline: boolean;

    constructor(vid: number, path: string, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number, isOnline: boolean) {
        super(startTime, duration, positionX, positionY);
        this.vid = vid;
        this.path = path;
        this.width = width;
        this.height = height;
        this.isOnline = isOnline;
    }
}

export default Video;