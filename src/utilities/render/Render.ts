import json from '../../assets/build.json';
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
import { TimelineMax, TweenMax, gsap } from 'gsap/all';
import CursorAnimation from './entity/Animation/CursorAnimation';
import Position from './entity/Element/Position';
import SlideAnimation from './entity/Animation/SlideAnimation';
import ScaleAnimation from './entity/Animation/ScaleAnimation';
import Element from './entity/Element/Element';
import Animation from './entity/Animation/Animation';
import Graphics from './entity/Element/Graphics';

class Render {
    ilv: ILV;
    timeline: TimelineMax;

    constructor(min?) {
        this.ilv = new ILV(json.title, json.course, json.chapter, json.author, json.semester, json.audio, json.subtitle);
        this.buildFonts();
        this.buildSlides(min);
    }

    getILV(): ILV {
        return this.ilv;
    }

    buildAnimations(): void {
        // for (let text of this.ilv.getTexts()) {
        //     this.ilv.animations.push(new FadeAnimation(1e3 + text.tid, AnimationEnum.Fade, text.startTime, text.duration, text));
        // }
        // for (let custom of this.ilv.getCustomes()) {
        //     this.ilv.animations.push(new FadeAnimation(1e3 + custom.cid, AnimationEnum.Fade, custom.startTime, custom.duration, custom));
        // }
        // for (let image of this.ilv.getImages()) {
        //     this.ilv.animations.push(new FadeAnimation(1e3 + image.iid, AnimationEnum.Fade, image.startTime, image.duration, image));
        // }
        // for (let video of this.ilv.getVideos()) {
        //     this.ilv.animations.push(new FadeAnimation(1e3 + video.vid, AnimationEnum.Fade, video.startTime, video.duration, video));
        // }
        // for (let quiz of this.ilv.getQuizzes()) {
        //     this.ilv.animations.push(new FadeAnimation(1e3 + quiz.qid, AnimationEnum.Fade, quiz.startTime, quiz.duration, quiz));
        // }
        // for (let animation of json.animations) {
        //     switch (animation.type) {
        //         case 'cursor': {
        //             this.ilv.animations.push(new CursorAnimation(2e3, AnimationEnum.Cursor, animation.startTime, animation.duration, new Position(animation.moveTo.x, animation.moveTo.y)));
        //             break;
        //         }

        //         case 'slide': {
        //             this.ilv.animations.push(new SlideAnimation(3e3, AnimationEnum.Slide, animation.startTime, animation.duration, animation.elementId, animation.elementType, new Position(animation.toPosition.x, animation.toPosition.y)));
        //             break;
        //         }

        //         case 'scale': {
        //             this.ilv.animations.push(new ScaleAnimation(4e3, AnimationEnum.Scale, animation.startTime, animation.duration, animation.elementId, animation.elementType, new Position(animation.toScale.x, animation.toScale.y)));
        //             break;
        //         }
        //     }
        // }
        // console.log(this.getILV().animations);

        for (let slide of this.getILV().getSlides()) {
            for (let animation of slide.getAnimations()) {
                this.ilv.pushAnimation(animation);
            }
        }
    }

    getTimeline(): TimelineMax {
        this.timeline = new TimelineMax();
        this.timeline.addLabel("start", 0);
        for (let animation of this.getILV().getAnimations()) {
            animation.animate(this.timeline);
        }
        return this.timeline;
    }

    // buildQuizzes(): void {
    //     for (let quiz of json.quizzes) {
    //         this.ilv.pushQuiz(new Quiz(quiz.qid, quiz.type, quiz.emphasisTime, quiz.questionContent, quiz.correctAnswer, quiz.wrongAnswers, quiz.tip, quiz.startTime, quiz.duration, quiz.position.x, quiz.position.y, quiz.width, quiz.height));
    //     }
    // }

    // buildVideos(): void {
    //     for (let video of json.videos) {
    //         this.ilv.pushVideo(new Video(video.vid, video.path, video.startTime, video.duration, video.emphasisTime, video.position.x, video.position.y, video.width, video.height, video.isOnline));
    //     }
    // }

    // buildImages(): void {
    //     for (let image of json.images) {
    //         this.ilv.pushImage(new Image(image.iid, image.startTime, image.duration, image.emphasisTime, image.position.x, image.position.y, image.width, image.height, image.path, image.isOnline));
    //     }
    // }

    buildSlides(min): void {
        if (!min) {
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
        } else {
            for (let slide of json.slides) {
                this.ilv.pushSlide(new Slide(slide.sid, slide.page, slide.name, slide.startTime, slide.duration));
            }
        }
    }

    buildSlideTexts(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.texts.length > 0) {
            for (let text of slideJSON.texts) {
                let textObject = new Text(text.tid, text.content, text.startTime, text.emphasisTime, text.duration, text.position.x, text.position.y, text.fontSize, text.fontColor, text.fontFamily, text.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + text.tid, AnimationEnum.Fade, text.startTime, text.duration, textObject));
                this.buildElementTransformation(text, textObject, slideObject.animations);
                slideObject.pushText(textObject);
            }
        }
        let titleObject = new Text(slideJSON.page + 9e2, `**${slideJSON.name}**`, slideJSON.startTime, -1, slideJSON.duration, 90, 85, 48, "#000", "Arial", 1);
        slideObject.animations.push(new FadeAnimation(1e3 + titleObject.tid, AnimationEnum.Fade, titleObject.startTime, titleObject.duration, titleObject));
        slideObject.pushText(titleObject);
    }

    buildSlideImages(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.images.length > 0) {
            for (let image of slideJSON.images) {
                let imageObject = new Image(image.iid, image.startTime, image.duration, image.emphasisTime, image.position.x, image.position.y, image.width, image.height, image.path, image.isOnline, image.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + image.iid, AnimationEnum.Fade, image.startTime, image.duration, imageObject));
                this.buildElementTransformation(image, imageObject, slideObject.animations);
                slideObject.pushImage(imageObject);
            }
        }
    }

    buildSlideVideos(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.videos.length > 0) {
            for (let video of slideJSON.videos) {
                let videoObject = new Video(video.vid, video.path, video.startTime, video.duration, video.emphasisTime, video.position.x, video.position.y, video.width, video.height, video.isOnline, video.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + video.vid, AnimationEnum.Fade, video.startTime, video.duration, videoObject));
                this.buildElementTransformation(video, videoObject, slideObject.animations);
                slideObject.pushVideo(videoObject);
            }
        }
    }

    buildSlideQuizzes(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.quizzes.length > 0) {
            for (let quiz of slideJSON.quizzes) {
                let quizObject = new Quiz(quiz.qid, quiz.type, quiz.emphasisTime, quiz.questionContent, quiz.correctAnswer, quiz.wrongAnswers, quiz.tip, quiz.startTime, quiz.duration, quiz.position.x, quiz.position.y, quiz.width, quiz.height, quiz.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + quiz.qid, AnimationEnum.Fade, quiz.startTime, quiz.duration, quizObject));
                this.buildElementTransformation(quiz, quizObject, slideObject.animations);
                slideObject.pushQuiz(quizObject);
            }
        }
    }

    buildSlideCustomes(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.customes.length > 0) {
            for (let custom of slideJSON.customes) {
                let customObject = new Custom(custom.qid, custom.path, custom.emphasisTime, custom.htmlContent, custom.startTime, custom.duration, custom.position.x, custom.position.y, custom.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + custom.cid, AnimationEnum.Fade, custom.startTime, custom.duration, customObject));
                this.buildElementTransformation(custom, customObject, slideObject.animations);
                slideObject.pushCustom(customObject);
            }
        }
    }

    buildSlideGraphics(slideJSON: any, slideObject: Slide): void {
        if (slideJSON.graphics.length > 0) {
            for (let graphics of slideJSON.graphics) {
                let graphicsObject = new Graphics(graphics.gid, graphics.startTime, graphics.emphasisTime, graphics.duration, graphics.position.x, graphics.position.y, graphics.width, graphics.height, graphics.type, graphics.strokeWidth, graphics.strokeColor, graphics.zIndex);
                slideObject.animations.push(new FadeAnimation(1e3 + graphics.gid, AnimationEnum.Fade, graphics.startTime, graphics.duration, graphicsObject));
                this.buildElementTransformation(graphics, graphicsObject, slideObject.animations);
                slideObject.pushGraphics(graphicsObject);
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

    // buildText(): void {
    //     for (let text of json.texts) {
    //         this.ilv.pushText(new Text(text.tid, text.content, text.startTime, text.emphasisTime, text.duration, text.position.x, text.position.y, text.fontSize, text.fontColor, text.fontFamily));
    //     }
    // }

    // buildCustomes(): void {
    //     for (let custom of json.customes) {
    //         this.ilv.pushCustom(new Custom(custom.cid, custom.path, custom.emphasisTime, custom.htmlContent, custom.startTime, custom.duration, custom.position.x, custom.position.y));
    //     }
    // }

    buildFonts(): void {
        for (let font of json.fonts) {
            this.ilv.pushFont(new Font(font.fid, font.path, font.isOnline, font.type));
        }
    }

    getFontsHTML(): HTMLElement {
        let fontStyleElement = document.createElement('style');
        for (let font of this.ilv.getFonts()) {
            if (font.isOnline) {
                fontStyleElement.innerHTML += `@import url('${font.path}');\n`;
            }
        }
        return fontStyleElement;
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

        for (let slide of this.ilv.getSlides()) {
            // let span = document.createElement('span');
            // span.className = 'content_item';
            // span.id = `TID_${slide.sid}`;
            // span.innerHTML = slide.name;
            // contentNavigation.innerHTML += `${slide.page}.`;
            // contentNavigation.append(span);
            // contentNavigation.innerHTML += ` (${secondFormatter(slide.startTime)})<br/>`;
            contentNavigation.innerHTML += `${slide.page}.<span class="content_item" id="TID_${slide.sid}"
            data-start-time="${slide.startTime}" 
            data-duration="${slide.duration}" 
            data-page="${slide.page}" 
            data-name="${slide.name}" 
            data-sid="${slide.sid}">${slide.name}</span> 
            (${secondFormatter(slide.startTime)})<br/>`;
            // contentNavigation.onclick = () => {
            //     howler.seek(slide.startTime);
            // }
        }

        return contentNavigation;
    }

    // getQuizHTML(quiz: Quiz): Element {
    //     let quizDivElement = document.createElement('div');
    //     quizDivElement.className = "quizComponent";
    //     if (quiz.width && quiz.height) {
    //         quizDivElement.setAttribute('style', `left: ${quiz.position.x}px; top: ${quiz.position.y}px; width: ${quiz.width}px; height: ${quiz.height}px;`);
    //     } else {
    //         quizDivElement.setAttribute('style', `left: ${quiz.position.x}px; top: ${quiz.position.y}px;`);
    //     }
    //     quizDivElement.id = `QID_${quiz.qid}`;

    //     let questionRow = document.createElement('div');
    //     questionRow.className = 'questionRow';
    //     questionRow.innerHTML = `<span>
    //         <img class='quizIcon' src='public_imgs/question.png' />
    //     </span>
    //     <span class='questionContent'>${quiz.questionContent}</span>`;
    //     let questionOptionBlock = document.createElement('div');
    //     questionOptionBlock.className = 'questionOptionBlock';
    //     let answers = [];
    //     if (quiz.type == "MC") {
    //         for (let answer of quiz.wrongAnswers) {
    //             answers.push({
    //                 isCorrect: false,
    //                 content: answer
    //             });
    //         }

    //         let correctAnswer = quiz.correctAnswer;
    //         answers.push({
    //             isCorrect: true,
    //             content: correctAnswer
    //         });
    //     } else if (quiz.type == "TF") {
    //         let correctAnswer = quiz.correctAnswer;
    //         answers.push({
    //             isCorrect: true,
    //             content: correctAnswer
    //         });
    //         if (correctAnswer.toLocaleLowerCase() == 'true') {
    //             answers.push({
    //                 isCorrect: false,
    //                 content: 'False'
    //             });
    //         } else {
    //             answers.push({
    //                 isCorrect: false,
    //                 content: 'Ture'
    //             });
    //         }
    //     }

    //     const shuffleArray = (array) => {
    //         for (var i = array.length - 1; i > 0; i--) {
    //             var j = Math.floor(Math.random() * (i + 1));
    //             var temp = array[i];
    //             array[i] = array[j];
    //             array[j] = temp;
    //         }
    //     }

    //     shuffleArray(answers);

    //     for (let [index, item] of answers.entries()) {
    //         questionOptionBlock.innerHTML += `<div class='questionOption' data-correct=${item.isCorrect} id='QID_${quiz.qid}_Option_${index}'>
    //             <div class='optionContainer'>
    //                 <span class='optionNo'>${String.fromCharCode(index + 65)}.&nbsp;</span>
    //                 <span class='optionContent'>${item.content}</span>
    //             </div>
    //         </div>`;
    //     }

    //     let questionFeedback = document.createElement('div');
    //     questionFeedback.style.visibility = 'hidden';
    //     questionFeedback.style.opacity = '0';
    //     questionFeedback.className = 'questionFeedback';
    //     questionFeedback.innerHTML = `<img class='feedbackIcon' src='public_imgs/cross_mark.png' />
    //     <label class='feedbackContent'>Falsch :( </label>`;

    //     let questionTip = document.createElement('div');
    //     questionTip.className = 'questionTip';
    //     questionTip.style.visibility = 'hidden';
    //     questionTip.style.opacity = '0';
    //     questionTip.innerHTML = `<span>
    //         <img class='quizIcon' src='public_imgs/info.png' />
    //     </span>
    //     <span class='questionTipContent'>${quiz.tip}</span>`;

    //     questionRow.appendChild(questionOptionBlock);
    //     questionRow.appendChild(questionFeedback);
    //     questionRow.appendChild(questionTip);

    //     quizDivElement.appendChild(questionRow);

    //     // let quizScript = document.createElement('script');
    //     // quizScript.innerText = `
    //     //     // $('.questionOption').click(()=>{
    //     //     //     console.log('AAA');
    //     //     // });
    //     // `;
    //     // quizDivElement.appendChild(quizScript);

    //     return quizDivElement;
    // }

    // getCustomHTML(custom: Custom): Element {
    //     let _doc = new DOMParser().parseFromString(custom.htmlContent, 'text/html');
    //     let customElement = <HTMLDivElement>_doc.body.getElementsByClassName('customComponent')[0];
    //     customElement.setAttribute('style', `left: ${custom.position.x}px; top: ${custom.position.y}px;`);
    //     customElement.id = `TID_${custom.cid}`;
    //     // customElement.dataset.duration = `${custom.duration}`;
    //     // customElement.dataset.x = `${custom.position.x}`;
    //     // customElement.dataset.y = `${custom.position.y}`;
    //     // customElement.dataset.cid = `${custom.cid}`;
    //     // customElement.dataset.path = `${custom.path}`;
    //     // customElement.dataset.startTime = `${custom.startTime}`;

    //     return _doc.body.getElementsByClassName('customComponent')[0];
    // }

    // getTextHTML(text: Text): Element {
    //     let slideTextElement = document.createElement('span');
    //     slideTextElement.className = 'slideText';
    //     slideTextElement.setAttribute('style', `left: ${text.position.x}px; top: ${text.position.y}px; 
    //         font-size: ${text.fontSize}px; color: ${text.fontColor}; font-family: ${text.fontFamily}`);

    //     let slideTextSquare = document.createElement('span');
    //     slideTextSquare.className = 'slideTextSquare';

    //     let slideTextContent = document.createElement('span');
    //     slideTextContent.className = 'slideTextContent';

    //     let tempSpan = document.createElement('span');

    //     tempSpan.innerHTML = Marked(text.content);

    //     slideTextContent.appendChild(tempSpan);
    //     slideTextElement.appendChild(slideTextSquare);
    //     slideTextElement.appendChild(slideTextContent);
    //     slideTextElement.id = `TID_${text.tid}`;
    //     // slideTextContent.dataset.duration = `${text.duration}`;
    //     // slideTextContent.dataset.fontColor = `${text.fontColor}`;
    //     // slideTextContent.dataset.fontSize = `${text.fontSize}`;
    //     // slideTextContent.dataset.fontFamily = `${text.fontFamily}`;
    //     // slideTextContent.dataset.x = `${text.position.x}`;
    //     // slideTextContent.dataset.y = `${text.position.y}`;
    //     // slideTextContent.dataset.startTime = `${text.startTime}`;
    //     // slideTextContent.dataset.tid = `${text.tid}`;

    //     return slideTextElement;
    // }

    // getImageHTML(image: Image): Element {
    //     let imgElement = document.createElement('img');
    //     if (image.isOnline) {
    //         // console.log(image.path);
    //         imgElement.src = image.path;
    //     } else {
    //         imgElement.src = `assests/image/${image.path}`;
    //     }
    //     imgElement.height = image.height;
    //     imgElement.width = image.width;
    //     imgElement.setAttribute('style', `left: ${image.position.x}px; top: ${image.position.y}px;`);
    //     imgElement.id = `IID_${image.iid}`;
    //     // imgElement.dataset.duration = `${image.duration}`;
    //     // imgElement.dataset.height = `${image.height}`;
    //     // imgElement.dataset.iid = `${image.iid}`;
    //     // imgElement.dataset.isOnline = `${image.isOnline}`;
    //     // imgElement.dataset.path = `${image.path}`;
    //     // imgElement.dataset.x = `${image.position.x}`;
    //     // imgElement.dataset.y = `${image.position.y}`;
    //     // imgElement.dataset.startTime = `${image.startTime}`;
    //     // imgElement.dataset.width = `${image.width}`;

    //     return imgElement;
    // }

    // getVideoHTML(video: Video): Element {
    //     let objectElement: any;

    //     if (video.isOnline) {
    //         objectElement = document.createElement('object');
    //         objectElement.data = video.path;
    //         objectElement.id = `VID_${video.vid}`;
    //         objectElement.width = `${video.width}px`;
    //         objectElement.height = `${video.height}px`;
    //     } else {
    //         objectElement = document.createElement('video');
    //         objectElement.src = "assests/video/" + video.path;
    //         objectElement.controls = 'controls';
    //         objectElement.autoplay = false;
    //         objectElement.id = `VID_${video.vid}`;
    //         objectElement.width = video.width;
    //         objectElement.height = video.height;
    //     }

    //     // objectElement.dataset.vid = `${video.vid}`;
    //     // objectElement.dataset.duration = `${video.duration}`;
    //     // objectElement.dataset.height = `${video.height}`;
    //     // objectElement.dataset.path = `${video.path}`;
    //     // objectElement.dataset.isOnline = `${video.isOnline}`;
    //     // objectElement.dataset.x = `${video.position.x}`;
    //     // objectElement.dataset.y = `${video.position.y}`;
    //     // objectElement.dataset.startTime = `${video.startTime}`;
    //     // objectElement.dataset.width = `${video.width}`;

    //     return objectElement;
    // }

    getFooter(slide: Slide): any {
        return {
            intitution: 'Hochschule Hannover',
            info1: json.course + ' ' + json.title + ' ' + json.semester,
            info2: json.chapter,
            lecturer: json.author,
            page: 'Seite ' + this.ilv.getSlides()[0].page
        };
    }
}

export default Render;