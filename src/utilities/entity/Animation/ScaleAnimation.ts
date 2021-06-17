import Position from "../Element/Position";
import Animation from "./Animation";
import AnimationEnum from "./AnimationEnum";


class ScaleAnimation extends Animation {
    toScale: number;
    elementId: number;
    elementType: string;

    constructor(aid: number, type: AnimationEnum, startTime: number, duration: number, elementId: number, elementType: string, toScale: number) {
        super(aid, type, startTime, duration);
        this.toScale = toScale;
        this.elementId = elementId;
        this.elementType = elementType;
    }

    animate(timeline: gsap.core.Timeline): void {
        timeline.to(document.getElementById(`${this.elementType.charAt(0).toUpperCase()}ID_${this.elementId}`), { scaleX: this.toScale, scaleY: this.toScale, duration: this.duration }, `start+=${this.startTime}`);
    }
}

export default ScaleAnimation;