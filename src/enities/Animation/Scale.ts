import Point from "./Point";
import Animation from "./Animation";
import AnimationEnum from './AnimationEnum';
import * as PIXI from 'pixi.js';


class Scale extends Animation {
    scaleX: number;
    scaleY: number;

    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number , scaleX: number, scaleY: number) {
        super(id, type, object, parent, startTime, duration);
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }

    animate(timeline: TimelineMax) {
        super.sort();
        timeline.to(this.object, {pixi: {scaleX: this.scaleX, scaleY: this.scaleY}, duration: this.duration}, `start+=${this.startTime}`);
    }
}

export default Scale;