import ilvJSON from '../assets/build.json';

// import axios from 'axios';
// import webvtt from 'node-webvtt';

import ILV from './entity/ILV';
import Slide from './entity/Slide';
import Text from './entity/Element/Text';
import Custom from './entity/Element/Custom';
import Image from './entity/Element/Image';
import Video from './entity/Element/Video';
import Font from './entity/Font';
import Quiz from './entity/Element/Quiz';
import FadeAnimation from './entity/Animation/FadeAnimation';
import AnimationEnum from './entity/Animation/AnimationEnum';
import CursorAnimation from './entity/Animation/CursorAnimation';
import Position from './entity/Element/Position';
import MoveAnimation from './entity/Animation/MoveAnimation';
import ScaleAnimation from './entity/Animation/ScaleAnimation';
import Element from './entity/Element/Element';
import Animation from './entity/Animation/Animation';
import Graphics from './entity/Element/Graphics';
import Cue from './entity/Cue';

class ILVGenerator {
    ilv: ILV;

    constructor() {
        this.ilv = new ILV(ilvJSON.title, ilvJSON.course, ilvJSON.chapter, ilvJSON.author, ilvJSON.semester, ilvJSON.audio);
        this.buildSubtitles();
        this.buildFonts();
        this.buildSlides();
    }

    getILV(): ILV {
        return this.ilv;
    }

    integrateAnimationArray(): void {
        for (let slide of this.getILV().getSlides()) {
            for (let animation of slide.getAnimations()) {
                this.ilv.pushAnimation(animation);
            }
        }
    }

    buildSlides(): void {
        for (let slide of ilvJSON.slides) {
            let slideObject = new Slide(slide.sid, slide.page, slide.name, slide.startTime, slide.duration);
            this.buildSlideTexts(slide, slideObject);
            this.buildSlideImages(slide, slideObject);
            this.buildSlideVideos(slide, slideObject);
            this.buildSlideQuizzes(slide, slideObject);
            this.buildSlideCustoms(slide, slideObject);
            this.buildSlideGraphics(slide, slideObject);
            this.buildCursorAnimation(slide, slideObject);
            this.ilv.pushSlide(slideObject);
        }
        this.integrateAnimationArray();
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
        let titleObject = new Text(slideJSON.page + 9e2, `<strong>${slideJSON.name}</strong>`, slideJSON.startTime, slideJSON.duration, 90, 85, 48, "#000", "Arial", 1);
        slideObject.animations.push(new FadeAnimation(1e3 + titleObject.tid, AnimationEnum.Fade, titleObject.startTime, titleObject.duration, titleObject));
        slideObject.pushElement(titleObject);
    }

    buildSlideImages(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.images.length > 0) {
            for (let image of slideJSON.images) {
                let imageObject = new Image(image.iid, image.startTime, image.duration, image.position.x, image.position.y, image.width, image.height, image.path, image.isOnline, image.zIndex);
                slideObject.animations.push(new FadeAnimation(AnimationEnum.Fade + image.iid, AnimationEnum.Fade, image.startTime, image.duration, imageObject));
                this.buildElementTransformation(image, imageObject, slideObject.animations);
                slideObject.pushElement(imageObject);
            }
        }
    }

    buildSlideVideos(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.videos.length > 0) {
            for (let video of slideJSON.videos) {
                let videoObject = new Video(video.vid, video.path, video.startTime, video.duration, video.position.x, video.position.y, video.width, video.height, video.isOnline, video.isYouTube, video.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + video.vid, AnimationEnum.Fade, video.startTime, video.duration, videoObject));
                this.buildElementTransformation(video, videoObject, slideObject.animations);
                slideObject.pushElement(videoObject);
            }
        }
    }

    buildSlideQuizzes(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.quizzes.length > 0) {
            for (let quiz of slideJSON.quizzes) {
                let quizObject = new Quiz(quiz.qid, quiz.questionContent, quiz.correctAnswer, quiz.wrongAnswers, quiz.tip, quiz.startTime, quiz.duration, quiz.position.x, quiz.position.y, quiz.width, quiz.height, quiz.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + quiz.qid, AnimationEnum.Fade, quiz.startTime, quiz.duration, quizObject));
                this.buildElementTransformation(quiz, quizObject, slideObject.animations);
                slideObject.pushElement(quizObject);
            }
        }
    }

    buildSlideCustoms(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.customs.length > 0) {
            for (let custom of slideJSON.customs) {
                // console.log(custom);

                // let customObject = new Custom(custom.cid, custom.path, custom.htmlContent, custom.scriptContent, custom.styleContent, custom.startTime, custom.duration, custom.width, custom.height, custom.position.x, custom.position.y, custom.zIndex);
                let customObject = new Custom(custom.cid, custom.path, custom.htmlContent, custom.scriptContent, custom.styleContent, custom.startTime, custom.duration, custom.position.x, custom.position.y, custom.zIndex);
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


    buildCursorAnimation(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.animations.length > 0) {
            for (let cursor of slideJSON.animations) {
                slideObject.pushAnimation(new CursorAnimation(2e3, AnimationEnum.Cursor, cursor.startTime, cursor.duration, new Position(cursor.moveTo.x, cursor.moveTo.y)));
            }
        }
    }

    buildElementTransformation(elementJSON: any, elementObject: Element, animationArray: Array<Animation>): void {
        if (elementJSON.transformations.length > 0) {
            for (let transformation of elementJSON.transformations) {
                if (transformation.type == "move") {
                    let slideAnimation = new MoveAnimation(3e3, AnimationEnum.Move, transformation.startTime, transformation.duration, transformation.elementId, transformation.elementType, new Position(transformation.toPosition.x, transformation.toPosition.y));
                    elementObject.pushTransformation(slideAnimation);
                    animationArray.push(slideAnimation);
                } else if (transformation.type == "scale") {
                    let scaleAnimation = new ScaleAnimation(4e3, AnimationEnum.Scale, transformation.startTime, transformation.duration, transformation.elementId, transformation.elementType, transformation.toScale);
                    elementObject.pushTransformation(scaleAnimation);
                    animationArray.push(scaleAnimation);
                }
            }
        }
    }

    buildFonts(): void {
        for (let font of ilvJSON.fonts) {
            this.ilv.pushFont(new Font(font.fid, font.path, font.isGoogle, font.isLocal));
        }
    }

    buildSubtitles(): void {
        if (ilvJSON.cues.length > 0) {
            // axios.get(`assets/subtitle/${this.getILV().subtitle}`).then(res => {
            for (let item of ilvJSON.cues) {
                this.ilv.pushCue(new Cue(item.identifier, item.start, item.end, item.text));
            }
            // });
        }
    }
}

export default ILVGenerator;