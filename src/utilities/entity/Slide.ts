import Text from "./Element/Text";
import Video from "./Element/Video";
import Image from "./Element/Image";
import Quiz from "./Element/Quiz";
import Animation from "./Animation/Animation";
import Custom from "./Element/Custom";
import Graphics from "./Element/Graphics";
import Element from "./Element/Element";

class Slide {
    sid: number;
    page: number;
    name: string;
    startTime: number;
    duration: number;


    // texts: Array<Text>;
    animations: Array<Animation>;
    // quizzes: Array<Quiz>;
    // customes: Array<Custom>;
    // videos: Array<Video>;
    // images: Array<Image>;
    // graphics: Array<Graphics>;

    elements: Array<Element>;

    constructor(sid: number, page: number, name: string, startTime: number, duration: number) {
        this.startTime = startTime;
        this.duration = duration;
        this.name = name;
        this.sid = sid;
        this.page = page;

        this.elements = new Array<Element>();

        // this.texts = new Array<Text>();
        this.animations = new Array<Animation>();
        // this.quizzes = new Array<Quiz>();
        // this.customes = new Array<Custom>();
        // this.videos = new Array<Video>();
        // this.images = new Array<Image>();
        // this.graphics = new Array<Graphics>();
    }

    getElements(): Array<Element> {
        return this.elements;
    }

    pushElement(element: Element): void {
        this.elements.push(element);
    }

    // getTexts(): Array<Text> {
    //     return this.texts;
    // }

    // pushText(text: Text): void {
    //     this.texts.push(text);
    // }

    getAnimations(): Array<Animation> {
        return this.animations;
    }

    pushAnimation(animation: Animation) {
        this.animations.push(animation);
    }

    // getCustomes(): Array<Custom> {
    //     return this.customes;
    // }

    // pushCustom(custom: Custom): void {
    //     this.customes.push(custom);
    // }

    // getVideos(): Array<Video> {
    //     return this.videos;
    // }

    // pushVideo(video: Video): void {
    //     this.videos.push(video);
    // }

    // getImages(): Array<Image> {
    //     return this.images;
    // }

    // pushImage(image: Image): void {
    //     this.images.push(image);
    // }

    // getQuizzes(): Array<Quiz> {
    //     return this.quizzes;
    // }

    // pushQuiz(quiz: Quiz): void {
    //     this.quizzes.push(quiz);
    // }

    // getGraphics(): Array<Graphics> {
    //     return this.graphics;
    // }

    // pushGraphics(graphics: Graphics): void {
    //     this.graphics.push(graphics);
    // }
}

export default Slide;