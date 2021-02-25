import AnimationEnum from "./AnimationEnum";
import Animation from "./Animation";
import Point from "./Point";
import * as PIXI from 'pixi.js';

class DrawQuestionBlockTypeOne extends Animation {
    point: Point;
    question: string;
    tip: string;
    tipImgPath: string;

    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number, point: Point, question: string, tip: string, tipImgPath: string) {
        super(id, type, object, parent, startTime, duration);
        this.point = point;
        this.question = question;
        this.tip = tip;
        this.tipImgPath = tipImgPath;
        this.object.position.set(point.getX(), point.getY());
        this.object.alpha = 0;
    }

    animate(timeline: TimelineMax) {
        super.sort();
        timeline.to(this.object, { pixi: { alpha: 1 }, duration: 1, onStart: () => { this.parent.addChild(this.object); } }, `start+=${this.startTime}`)
            .to(this.object, { pixi: { alpha: 0 }, duration: 1, onComplete: () => { if (this.parent) { this.parent.removeChild(this.object); } } }, `start+=${this.startTime + this.duration}`)
    }
}

export default DrawQuestionBlockTypeOne;