import AnimationEnum from "./AnimationEnum";
import * as PIXI from 'pixi.js';
import { TimelineMax } from 'gsap/all';

abstract class Animation {
    id: number;
    type: AnimationEnum;
    object: PIXI.Container;
    parent: PIXI.Container;
    startTime: number;
    duration: number;
    played: boolean;

    constructor(id: number, type: AnimationEnum, object: PIXI.Container, parent: PIXI.Container, startTime: number, duration: number) {
        this.id = id;
        this.type = type;
        this.object = object;
        this.parent = parent;
        this.startTime = startTime;
        this.duration = duration;
        this.played = false;
        // if(parent) {
        //     if(!this.parent.children.includes(this.object)) {
        if (parent && this.type != AnimationEnum.DrawQuestionBlockTypeOne) {
            this.parent.addChild(this.object);
        }
        //     } 
        // }
    }

    animate(timeline: TimelineMax) { }

    sort(): void {
        if (this.parent) {
            this.parent.sortChildren();
        }
    }

    getID(): number {
        return this.id;
    }

    getType(): AnimationEnum {
        return this.type;
    }

    getStartTime(): number {
        return this.startTime;
    }

    getDuration(): number {
        return this.duration;
    }

    getPlayStatus(): boolean {
        return this.played;
    }
}

export default Animation;