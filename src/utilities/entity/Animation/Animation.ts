import AnimationEnum from "./AnimationEnum";
import { gsap } from "gsap";


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
    abstract animate(timeline: gsap.core.Timeline): void;
}

export default Animation;