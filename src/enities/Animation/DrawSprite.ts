import Animation from "./Animation";
import AnimationEnum from './AnimationEnum';
import * as PIXI from 'pixi.js';
import Point from "./Point";


class DrawSprite extends Animation {
    width: number;
    height: number;
    point: Point;

    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number, width: number, height: number, point: Point) {
        super(id, type, object, parent, startTime, duration);
        this.width = width;
        this.height = height;
        this.point = point;
    }

    animate(timeline: TimelineMax) {
        super.sort();
        // console.log(this.parent.name);
        if (this.duration < 10e5) {
            timeline.to(this.object, { pixi: { alpha: 1 }, duration: 1 }, `start+=${this.startTime}`)
                    .to(this.object, { pixi: { alpha: 0 }, duration: 1 }, `start+=${this.startTime + this.duration}`)
        } else {
            timeline.to(this.object, { pixi: { alpha: 1 }, duration: 1 }, `start+=${this.startTime}`);
        }
    }
}

export default DrawSprite;