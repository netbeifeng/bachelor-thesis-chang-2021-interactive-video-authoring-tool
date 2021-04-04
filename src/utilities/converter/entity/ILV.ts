import Animation from "./Animation";
import Custom from "./Custom";
import Image from "./Image";
import Quiz from "./Quiz";
import Slide from "./Slide";
import Text from "./Text";
import Video from "./Video";

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
    texts: Array<Text>;
    animations: Array<Animation>
    quizzes: Array<Quiz>;
    customes: Array<Custom>;
    videos: Array<Video>;
    images: Array<Image>;

    constructor(title: string, course: string, chapter: string, author: string, semester: string, audio: string, subtitle: string) {
        this.title = title;
        this.chapter = chapter;
        this.course = course;
        this.audio = audio;
        this.author = author;
        this.semester = semester;
        this.subtitle = subtitle;

        this.slides = new Array<Slide>();
        this.texts = new Array<Text>();
        this.animations = new Array<Animation>();
        this.quizzes = new Array<Quiz>();
        this.customes = new Array<Custom>();
        this.videos = new Array<Video>();
        this.images = new Array<Image>();
    }

    getSlides(): Array<Slide> {
        return this.slides;
    }

    pushSlide(slide: Slide): void {
        this.slides.push(slide);
    }

    getTexts(): Array<Text> {
        return this.texts;
    }

    pushText(text: Text): void {
        this.texts.push(text);
    }

    getAnimations(): Array<Animation> {
        return this.animations;
    }

    getCustomes(): Array<Custom> {
        return this.customes;
    }

    pushCustom(custom: Custom) {
        this.customes.push(custom);
    }

    getVideos(): Array<Video> {
        return this.videos;
    }

    getImages(): Array<Image> {
        return this.images;
    }

    pushImage(image: Image): void {
        this.images.push(image);
    }

    getQuizzes(): Array<Quiz> {
        return this.quizzes;
    }
}

export default ILV;