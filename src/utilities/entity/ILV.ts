// import Animation from "./Animation/Animation";
// import Custom from "./Element/Custom";
import Animation from "./Animation/Animation";
import Font from "./Element/Font";
// import Image from "./Element/Image";
// import Quiz from "./Element/Quiz";
import Slide from "./Slide";
// import { gsap } from 'gsap/all';
import Cue from "./Cue";
// import Text from "./Element/Text";
// import Video from "./Element/Video";

class ILV {
    title: string;
    course: string;
    chapter: string;
    date: string;
    author: string;
    semester: string;

    audio: string;
    subtitle: string;

    slides: Array<Slide> = new Array<Slide>();
    animations: Array<Animation> = new Array<Animation>();
    // elements: Array<Element>;
    fonts: Array<Font> = new Array<Font>();
    cues: Array<Cue> = new Array<Cue>();
    // timeline: gsap.core.Timeline;

    constructor(title: string, course: string, chapter: string, author: string, semester: string, audio: string, subtitle?: string) {
        this.title = title;
        this.chapter = chapter;
        this.course = course;
        this.audio = audio;
        this.author = author;
        this.semester = semester;
        this.subtitle = subtitle;
    }

    // getElement(): Array<Element> {
    //     return this.elements;
    // }

    // pushElement(element: Element): void {
    //     this.elements.push(element);
    // }

    getSlides(): Array<Slide> {
        return this.slides;
    }

    pushSlide(slide: Slide): void {
        this.slides.push(slide);
    }

    getAnimations(): Array<Animation> {
        return this.animations;
    }

    pushAnimation(animation: Animation) {
        this.animations.push(animation);
    }

    getFonts(): Array<Font> {
        return this.fonts;
    }

    pushFont(font: Font): void {
        this.fonts.push(font);
    }

    getCues(): Array<Cue> {
        return this.cues;
    }

    pushCue(cue: Cue): void {
        this.cues.push(cue);
    }

    // getTimeline(): gsap.core.Timeline {
    //     this.timeline = gsap.timeline();
    //     this.timeline.addLabel("start", 0);
    //     for (let animation of this.getAnimations()) {
    //         animation.animate(this.timeline);
    //     }
    //     return this.timeline;
    // }

    getFooter(currentTime: number): any {
        return {
            intitution: 'Hochschule Hannover',
            info1: this.course + ' ' + this.title + ' ' + this.semester,
            info2: this.chapter,
            lecturer: this.author,
            page: 'Seite ' + this.getSlidePagebyTime(currentTime)
        };
    }

    getSlidePagebyTime(currentTime: number): number {
        for (let slide of this.getSlides()) {
            if (currentTime > slide.startTime && currentTime <= (slide.startTime + slide.duration)) {
                return slide.page;
            }
        }
        return -1;
    }

    getContentNaviHTML(): HTMLElement {
        let contentNavigation = document.createElement('div');
        contentNavigation.id = "content_navigation";
        contentNavigation.innerHTML += "<strong>Contents</strong><br/>";

        const secondFormatter = (sec) => {
            if (sec >= 60) {
                if (sec % 60 < 10) {
                    return `${(sec / 60).toFixed(0)}:0${(sec % 60)}`;
                }
                return `${(sec / 60).toFixed(0)}:${(sec % 60)}`;
            } else {
                return `0:${sec}`;
            }
        };

        for (let slide of this.getSlides()) {
            contentNavigation.innerHTML += `${slide.page}.<span class="content_item" id="NID_${slide.sid}"
            data-start-time="${slide.startTime}" 
            data-duration="${slide.duration}" 
            data-page="${slide.page}" 
            data-name="${slide.name}" 
            data-sid="${slide.sid}"
            >${slide.name}
            </span> 
            (${secondFormatter(slide.startTime)})<br/>`;
        }

        return contentNavigation;
    }

    getFontsHTML(): HTMLElement {
        let fontStyleElement = document.createElement('style');
        for (let font of this.getFonts()) {
            if (font.isOnline) {
                fontStyleElement.innerHTML += `@import url('${font.path}');\n`;
            }
        }
        return fontStyleElement;
    }
}

export default ILV;