import Animation from "./Animation/Animation";
import Font from "./Element/Font";
import Slide from "./Slide";
import Cue from "./Cue";


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
    fonts: Array<Font> = new Array<Font>();
    cues: Array<Cue> = new Array<Cue>();

    constructor(title: string, course: string, chapter: string, author: string, semester: string, audio: string, subtitle?: string) {
        this.title = title;
        this.chapter = chapter;
        this.course = course;
        this.audio = audio;
        this.author = author;
        this.semester = semester;
        this.subtitle = subtitle;
    }

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

    getFooter(): any {
        return {
            intitution: 'Hochschule Hannover',
            info1: this.course + ' ' + this.title + ' ' + this.semester,
            info2: this.chapter,
            lecturer: this.author
        };
    }

    getSlidePagebyTime(currentTime: number): number {
        for (let slide of this.getSlides()) {
            if (currentTime > slide.startTime && currentTime <= (slide.startTime + slide.duration)) {
                return slide.page;
            }
        }
        return 1;
    }
}

export default ILV;