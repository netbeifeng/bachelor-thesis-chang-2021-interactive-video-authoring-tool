import Element from "./Element";
import Position from "./Position";

class Slide {
    sid: number;
    page: number;
    name: string;
    startTime: number;
    duration: number;

    constructor(sid: number, page: number, name: string, startTime: number, duration: number) {
        this.startTime = startTime;
        this.duration = duration;
        this.name = name;
        this.sid = sid;
        this.page = page;
    }
}

export default Slide;