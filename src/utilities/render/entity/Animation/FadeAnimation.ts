import Element from "../Element/Element";
import Animation from "./Animation";
import AnimationEnum from "./AnimationEnum";
import { TimelineMax } from "gsap/all";
import Custom from "../Element/Custom";


class FadeAnimation extends Animation {
    target: Element;

    constructor(aid: number, type: AnimationEnum, startTime: number, duration: number, target: Element) {
        super(aid, type, startTime, duration);
        this.target = target;
    }

    paint(): void {
        document.getElementById('htmlInteractionLayer').append(this.target.getHTMLElement());
        if(this.target instanceof Custom) {
            document.body.append(this.target.getScriptTagHTML());
        }
        this.painted = true;
    }

    animate(timeline: TimelineMax): void {
        timeline.to(`#${this.target.getID()}`, { visibility: 'visible', opacity: 1, duration: 2 }, `start+=${this.target.startTime}`)
                .to(`#${this.target.getID()}`, { opacity: 0, duration: 2 }, `start+=${this.target.startTime + this.target.duration}`)
                .to(`#${this.target.getID()}`, { visibility: 'hidden' }, `start+=${this.target.startTime + this.target.duration + 2}`);

    }
}

export default FadeAnimation;