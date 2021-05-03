import AnimationEnum from "./AnimationEnum";
import { TimelineMax } from "gsap/all";


abstract class Animation {
    aid: number;
    type: AnimationEnum;
    startTime: number;
    duration: number;
    // painted: boolean = false;
    played: boolean = false;

    constructor(aid: number, type: AnimationEnum, startTime: number, duration: number) {
        this.aid = aid;
        this.type = type;
        this.startTime = startTime;
        this.duration = duration;
    }

    // abstract paint(): void;
    abstract animate(timeline: TimelineMax): void;
}

export default Animation;