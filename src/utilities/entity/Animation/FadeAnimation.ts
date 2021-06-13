import Element from "../Element/Element";
import Animation from "./Animation";
import AnimationEnum from "./AnimationEnum";
import Video from "../Element/Video";
import { gsap } from "gsap";
import Custom from "../Element/Custom";



class FadeAnimation extends Animation {
    target: Element;

    constructor(aid: number, type: AnimationEnum, startTime: number, duration: number, target: Element) {
        super(aid, type, startTime, duration);
        this.target = target;
    }

    animate(timeline: gsap.core.Timeline): void {
        timeline.to(`#${this.target.getID()}`, {
            visibility: 'visible', opacity: 1, duration: 2, onComplete: () => {
                if (this.target instanceof Video) {
                    document.getElementById("player_switch").click();
                    let player = <HTMLVideoElement>document.getElementById(this.target.getID());
                    player.play();
                } else if (this.target instanceof Custom) {
                    if(this.target.styleContent) {
                        document.head.append(this.target.getStyleTagHTMLOfCSS());
                    }

                    if(this.target.scriptContent) {
                        document.body.append(this.target.getScriptTagHTMLOfJS());
                    }
                }
            }
        }, `start+=${this.target.startTime}`)
            .to(`#${this.target.getID()}`, { opacity: 0, duration: 2 }, `start+=${this.target.startTime + this.target.duration}`)
            .to(`#${this.target.getID()}`, { visibility: 'hidden' }, `start+=${this.target.startTime + this.target.duration + 2}`);
    }
}

export default FadeAnimation;