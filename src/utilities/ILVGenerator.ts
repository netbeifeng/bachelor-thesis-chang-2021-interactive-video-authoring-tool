import json from '../assets/build.json';
import { Base64 } from 'js-base64';

import ILV from './entity/ILV';
import Slide from './entity/Slide';
import Text from './entity/Element/Text';
import Custom from './entity/Element/Custom';
import Image from './entity/Element/Image';
import Video from './entity/Element/Video';
import Font from './entity/Element/Font';
import Quiz from './entity/Element/Quiz';
import FadeAnimation from './entity/Animation/FadeAnimation';
import AnimationEnum from './entity/Animation/AnimationEnum';
import CursorAnimation from './entity/Animation/CursorAnimation';
import Position from './entity/Element/Position';
import SlideAnimation from './entity/Animation/SlideAnimation';
import ScaleAnimation from './entity/Animation/ScaleAnimation';
import Element from './entity/Element/Element';
import Animation from './entity/Animation/Animation';
import Graphics from './entity/Element/Graphics';

class ILVGenerator {
    ilv: ILV;

    constructor() {
        this.ilv = new ILV(json.title, json.course, json.chapter, json.author, json.semester, json.audio, json.subtitle);
        this.buildFonts();
        this.buildSlides();
    }

    getILV(): ILV {
        return this.ilv;
    }

    buildAnimations(): void {
        for (let slide of this.getILV().getSlides()) {
            for (let animation of slide.getAnimations()) {
                this.ilv.pushAnimation(animation);
            }
        }
    }

    buildSlides(): void {
        // if (!min) {
        for (let slide of json.slides) {
            let slideObject = new Slide(slide.sid, slide.page, slide.name, slide.startTime, slide.duration);
            this.buildSlideTexts(slide, slideObject);
            this.buildSlideImages(slide, slideObject);
            this.buildSlideVideos(slide, slideObject);
            this.buildSlideQuizzes(slide, slideObject);
            this.buildSlideCustomes(slide, slideObject);
            this.buildSlideGraphics(slide, slideObject);
            this.buildSlideAnimation(slide, slideObject);
            this.ilv.pushSlide(slideObject);
        }
        this.buildAnimations();
        // } else {
        //     for (let slide of json.slides) {
        //         this.ilv.pushSlide(new Slide(slide.sid, slide.page, slide.name, slide.startTime, slide.duration));
        //     }
        // }
    }

    buildSlideTexts(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.texts.length > 0) {
            for (let text of slideJSON.texts) {
                let textObject = new Text(text.tid, text.content, text.startTime, text.duration, text.position.x, text.position.y, text.fontSize, text.fontColor, text.fontFamily, text.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + text.tid, AnimationEnum.Fade, text.startTime, text.duration, textObject));
                this.buildElementTransformation(text, textObject, slideObject.animations);
                slideObject.pushElement(textObject);
            }
        }
        let titleObject = new Text(slideJSON.page + 9e2, `**${slideJSON.name}**`, slideJSON.startTime, slideJSON.duration, 90, 85, 48, "#000", "Arial", 1);
        slideObject.animations.push(new FadeAnimation(1e3 + titleObject.tid, AnimationEnum.Fade, titleObject.startTime, titleObject.duration, titleObject));
        slideObject.pushElement(titleObject);
    }

    buildSlideImages(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.images.length > 0) {
            for (let image of slideJSON.images) {
                let imageObject = new Image(image.iid, image.startTime, image.duration, image.position.x, image.position.y, image.width, image.height, image.path, image.isOnline, image.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + image.iid, AnimationEnum.Fade, image.startTime, image.duration, imageObject));
                this.buildElementTransformation(image, imageObject, slideObject.animations);
                slideObject.pushElement(imageObject);
            }
        }
    }

    buildSlideVideos(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.videos.length > 0) {
            for (let video of slideJSON.videos) {
                let videoObject = new Video(video.vid, video.path, video.startTime, video.duration, video.position.x, video.position.y, video.width, video.height, video.isOnline, video.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + video.vid, AnimationEnum.Fade, video.startTime, video.duration, videoObject));
                this.buildElementTransformation(video, videoObject, slideObject.animations);
                slideObject.pushElement(videoObject);
            }
        }
    }

    buildSlideQuizzes(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.quizzes.length > 0) {
            for (let quiz of slideJSON.quizzes) {
                let quizObject = new Quiz(quiz.qid, quiz.type, quiz.questionContent, quiz.correctAnswer, quiz.wrongAnswers, quiz.tip, quiz.startTime, quiz.duration, quiz.position.x, quiz.position.y, quiz.width, quiz.height, quiz.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + quiz.qid, AnimationEnum.Fade, quiz.startTime, quiz.duration, quizObject));
                this.buildElementTransformation(quiz, quizObject, slideObject.animations);
                slideObject.pushElement(quizObject);
            }
        }
    }

    buildSlideCustomes(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.customes.length > 0) {
            for (let custom of slideJSON.customes) {
                let customObject = new Custom(custom.qid, custom.path, custom.htmlContent, custom.startTime, custom.duration, custom.position.x, custom.position.y, custom.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + custom.cid, AnimationEnum.Fade, custom.startTime, custom.duration, customObject));
                this.buildElementTransformation(custom, customObject, slideObject.animations);
                slideObject.pushElement(customObject);
            }
        }
    }

    buildSlideGraphics(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.graphics.length > 0) {
            for (let graphics of slideJSON.graphics) {
                let graphicsObject = new Graphics(graphics.gid, graphics.startTime, graphics.duration, graphics.position.x, graphics.position.y, graphics.width, graphics.height, graphics.type, graphics.strokeWidth, graphics.strokeColor, graphics.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + graphics.gid, AnimationEnum.Fade, graphics.startTime, graphics.duration, graphicsObject));
                this.buildElementTransformation(graphics, graphicsObject, slideObject.animations);
                slideObject.pushElement(graphicsObject);
            }
        }
    }


    buildSlideAnimation(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.animations.length > 0) {
            for (let cursor of slideJSON.animations) {
                slideObject.pushAnimation(new CursorAnimation(2e3, AnimationEnum.Cursor, cursor.startTime, cursor.duration, new Position(cursor.moveTo.x, cursor.moveTo.y)));
            }
        }
    }

    buildElementTransformation(elementJSON: any, elementObject: Element, animationArray: Array<Animation>): void {
        if (elementJSON.transformations.length > 0) {
            for (let transformation of elementJSON.transformations) {
                if (transformation.type == "slide") {
                    let slideAnimation = new SlideAnimation(3e3, AnimationEnum.Slide, transformation.startTime, transformation.duration, transformation.elementId, transformation.elementType, new Position(transformation.toPosition.x, transformation.toPosition.y));
                    elementObject.pushTransformation(slideAnimation);
                    animationArray.push(slideAnimation);
                } else if (transformation.type == "scale") {
                    let scaleAnimation = new ScaleAnimation(4e3, AnimationEnum.Scale, transformation.startTime, transformation.duration, transformation.elementId, transformation.elementType, new Position(transformation.toScale.x, transformation.toScale.y));
                    elementObject.pushTransformation(scaleAnimation);
                    animationArray.push(scaleAnimation);
                }
            }
        }
    }

    buildFonts(): void {
        for (let font of json.fonts) {
            this.ilv.pushFont(new Font(font.fid, font.path, font.isOnline, font.type));
        }
    }
}

export default ILVGenerator;