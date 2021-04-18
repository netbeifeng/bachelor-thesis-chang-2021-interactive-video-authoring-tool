import Position from "../Element/Position";
import Animation from "./Animation";
import AnimationEnum from "./AnimationEnum";


class SlideAnimation extends Animation {
    toPosition: Position;
    elementId: number;
    elementType: string;
    target: any;

    constructor(aid: number, type: AnimationEnum, startTime: number, duration: number, elementId: number, elementType: string, toPosition: Position) {
        super(aid, type, startTime, duration);
        this.toPosition = toPosition;
        this.elementId = elementId;
        this.elementType = elementType;
    }
    paint(): void {
        let compundId = `${this.elementType.charAt(0).toUpperCase()}ID_${this.elementId}`;
        this.target = document.getElementById(compundId);
        this.painted = true;
    }

    animate(timeline: TimelineMax): void {
        timeline.to(this.target, { left: this.toPosition.x, top: this.toPosition.y, duration: this.duration }, `start+=${this.startTime}`);
    }

    erase(): void {

    }
}

export default SlideAnimation;