import Animation from "./Animation";
import AnimationEnum from "./AnimationEnum";
import FontStyle from "./FontStyle";
import * as PIXI from 'pixi.js';
import Point from "./Point";
import gsap from 'gsap';

class DrawText extends Animation {
    fontStyle: FontStyle;
    point: Point;
    animations: Array<any>;
    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number, fontStyle: FontStyle, point: Point) {
        super(id, type, object, parent, startTime, duration);
        this.fontStyle = fontStyle;
        this.point = point;
        this.object.x = this.point.getX();
        this.object.y = this.point.getY();
        this.object.alpha = 0;
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

export default DrawText;