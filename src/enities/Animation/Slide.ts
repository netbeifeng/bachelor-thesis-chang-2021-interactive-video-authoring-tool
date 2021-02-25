import Point from "./Point";
import Animation from "./Animation";
import AnimationEnum from './AnimationEnum';
import * as PIXI from 'pixi.js';

class Slide extends Animation {
    point: Point;

    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number, point: Point) {
        super(id, type, object, parent, startTime, duration);
        this.point = point;
    }

    animate(timeline: TimelineMax) {
        super.sort();
        timeline.to(this.object, { pixi: { x: this.point.getX(), y: this.point.getY() }, duration: this.duration }, `start+=${this.startTime}`);
    }
}

export default Slide;