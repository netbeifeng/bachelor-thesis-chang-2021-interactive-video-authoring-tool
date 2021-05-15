import Animation from "./Animation/Animation";
import Element from "./Element/Element";

class Slide {
    sid: number;
    page: number;
    name: string;
    startTime: number;
    duration: number;

    animations: Array<Animation>;
    elements: Array<Element>;

    constructor(sid: number, page: number, name: string, startTime: number, duration: number) {
        this.startTime = startTime;
        this.duration = duration;
        this.name = name;
        this.sid = sid;
        this.page = page;

        this.elements = new Array<Element>();
        this.animations = new Array<Animation>();
    }

    getElements(): Array<Element> {
        return this.elements;
    }

    pushElement(element: Element): void {
        this.elements.push(element);
    }

    getAnimations(): Array<Animation> {
        return this.animations;
    }

    pushAnimation(animation: Animation) {
        this.animations.push(animation);
    }
}

export default Slide;