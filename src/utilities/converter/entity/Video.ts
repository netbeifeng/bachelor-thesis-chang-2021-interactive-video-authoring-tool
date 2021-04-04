import Element from "./Element";
import Position from "./Position";

class Video extends Element {
    vid: number;
    url: string;
    startTime: number;
    duration: number;
    position: Position;
    width: number;
    height: number;

    constructor(vid: number, url: string, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number) {
        super(startTime, duration, positionX, positionY);
        this.vid = vid;
        this.url = url;
        this.width = width;
        this.height = height;
    }
}

export default Video;