import Position from "../Element/Position";
import Animation from "./Animation";
import AnimationEnum from "./AnimationEnum";


class ScaleAnimation extends Animation {
    toScale: Position;
    elementId: number;
    elementType: string;

    constructor(aid: number, type: AnimationEnum, startTime: number, duration: number, elementId: number, elementType: string, toScale: Position) {
        super(aid, type, startTime, duration);
        this.toScale = toScale;
        this.elementId = elementId;
        this.elementType = elementType;
    }

    animate(timeline: gsap.core.Timeline): void {
        timeline.to(document.getElementById(`${this.elementType.charAt(0).toUpperCase()}ID_${this.elementId}`), { scaleX: this.toScale.x, scaleY: this.toScale.y, duration: this.duration }, `start+=${this.startTime}`);
    }
}

export default ScaleAnimation;