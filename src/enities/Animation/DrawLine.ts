import AnimationEnum from "./AnimationEnum";
import Animation from "./Animation";
import Point from "./Point";
import * as PIXI from 'pixi.js';

class DrawLine extends Animation {
    startPoint: Point;
    endPoint: Point;
    arrow: boolean;
    direction: string;

    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number, startPoint: Point, endPoint: Point, arrow: boolean, direction: string) {
        super(id, type, object, parent, startTime, duration);
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.arrow = arrow;
        this.direction = direction;
    }

    animate(timeline: TimelineMax) {
        super.sort();
        if (this.duration < 10e5) {
            timeline.to(this.object, { pixi: { alpha: 1 }, duration: 1 }, `start+=${this.startTime}`)
                    .to(this.object, { pixi: { alpha: 0 }, duration: 1 }, `start+=${this.startTime + this.duration}`)
        } else {
            timeline.to(this.object, { pixi: { alpha: 1 }, duration: 1 }, `start+=${this.startTime}`);
        }

    }
}

export default DrawLine;