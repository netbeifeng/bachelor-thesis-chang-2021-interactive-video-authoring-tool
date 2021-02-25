import AnimationEnum from "./AnimationEnum";
import Animation from "./Animation";
import Point from "./Point";
import * as PIXI from 'pixi.js';
import gsap from 'gsap';

class CursorMove extends Animation {
    point: Point;

    offsetX: number;
    offsetY: number;

    tween: any;
    motionPath: {};
    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number, point: Point, offsetX: number, offsetY: number) {
        super(id, type, object, parent, startTime, duration);
        this.point = point;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        let x = this.point.getX();
        let y = this.point.getY();

        this.motionPath = {
            path: [{ x: x, y: y }, { x: x + offsetX, y: y - 2 * offsetY }, { x: x + 2 * offsetX, y: y - 2 * offsetY }, { x: x + 3 * offsetX, y: y }, { x: x + 2 * offsetX, y: y + 2 * offsetY }, { x: x + offsetX, y: y + 2 * offsetY }, { x: x, y: y }]
        }
        // this.timeline
        //     .to(this.object, { alpha: 1, duration: 1 }, `${this.type} + ${this.id} - 1`)
        //     .to(this.object, { motionPath: motionPath, duration: this.duration, ease: "none" }, `${this.type} + ${this.id} - 2`)
        //     .to(this.object, { alpha: 0, duration: 1 }, `${this.type} + ${this.id} - 3`)
    }

    animate(timeline: TimelineMax) {
        this.parent.addChild(this.object);
        timeline
            .to(this.object, { alpha: 1, duration: 1 }, `start+=${this.startTime}`)
            .to(this.object, { motionPath: this.motionPath, duration: this.duration, ease: "none" }, `start+=${this.startTime + 1}`)
            .to(this.object, { alpha: 0, duration: 1 }, `start+=${this.startTime + 1 + this.duration}`)
    }
}

export default CursorMove;