import Position from "../Element/Position";
import Animation from "./Animation";
import AnimationEnum from "./AnimationEnum";


class ScaleAnimation extends Animation {
    toScale: Position;
    elementId: number;
    elementType: string;
    target: any;

    constructor(aid: number, type: AnimationEnum, startTime: number, duration: number, elementId: number, elementType: string, toScale: Position) {
        super(aid, type, startTime, duration);
        this.toScale = toScale;
        this.elementId = elementId;
        this.elementType = elementType;
    }
    paint(): void {
        let compundId = `${this.elementType.charAt(0).toUpperCase()}ID_${this.elementId}`;
        this.target = document.getElementById(compundId);
        this.painted = true;
    }

    animate(timeline: TimelineMax): void {
        timeline.to(this.target, { scaleX: this.toScale.x, scaleY: this.toScale.y, duration: this.duration }, `start+=${this.startTime}`);
    }
}

export default ScaleAnimation;