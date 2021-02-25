import AnimationEnum from "./AnimationEnum";
import Animation from "./Animation";
import Point from "./Point";
import * as PIXI from 'pixi.js';

class DrawCircle extends Animation {
    point: Point;
    radius: number;

    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number, point: Point, radius: number) {
        super(id, type, object, parent, startTime, duration);
        this.point = point;
        this.radius = radius;
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

export default DrawCircle;