import Position from "../Element/Position";
import Animation from "./Animation";
import AnimationEnum from "./AnimationEnum";


class CursorAnimation extends Animation {
    moveTo: Position;

    constructor(aid: number, type: AnimationEnum, startTime: number, duration: number, moveTo: Position) {
        super(aid, type, startTime, duration);
        this.moveTo = moveTo;
    }


    animate(timeline: gsap.core.Timeline): void {
        timeline
        // .to(this.target, { visibility: 'visible', opacity: 1, duration: 2 }, `start+=${this.startTime - 2}`)
        .to(document.getElementById('cursor'), { left: this.moveTo.x, top: this.moveTo.y , duration: this.duration }, `start+=${this.startTime}`);
                // .to(this.target, { visibility: 'visible', opacity: 1, duration: 2 }, `start+=${this.startTime - 2}`)
    }
}

export default CursorAnimation;