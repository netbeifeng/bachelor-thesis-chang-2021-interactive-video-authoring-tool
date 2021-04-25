// import Animation from "./Animation/Animation";
// import Custom from "./Element/Custom";
import Animation from "./Animation/Animation";
import Font from "./Element/Font";
// import Image from "./Element/Image";
// import Quiz from "./Element/Quiz";
import Slide from "./Slide";
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

    slides: Array<Slide>;
    animations: Array<Animation>;
    // elements: Array<Element>;
    fonts: Array<Font>;

    constructor(title: string, course: string, chapter: string, author: string, semester: string, audio: string, subtitle: string) {
        this.title = title;
        this.chapter = chapter;
        this.course = course;
        this.audio = audio;
        this.author = author;
        this.semester = semester;
        this.subtitle = subtitle;

        this.slides = new Array<Slide>();
        // this.elements = new Array<Element>();
        this.animations = new Array<Animation>();
        this.fonts = new Array<Font>();
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
}

export default ILV;