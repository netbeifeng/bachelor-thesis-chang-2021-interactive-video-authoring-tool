import json from '../../assests/build.json';
import ILV from './entity/ILV';
import Slide from './entity/Slide';
import * as Marked from 'marked';
import Text from './entity/Text';
import Custom from './entity/Custom';
import Image from './entity/Image';
import Video from './entity/Video';
import Font from './entity/Font';

class Converter {
    ilv: ILV;

    constructor(isFont?: boolean) {
        this.ilv = new ILV(json.title, json.course, json.chapter, json.author, json.semester, json.audio, json.subtitle);
        if (isFont) {
            this.buildFont();
        } else {
            this.buildSlide();
            this.buildText();
            this.buildCustom();
            this.buildImage();
            this.buildVideo();
        }
    }

    getILV(): ILV {
        return this.ilv;
    }

    buildVideo(): void {
        for (let video of json.videos) {
            this.ilv.pushVideo(new Video(video.vid, video.path, video.startTime, video.duration, video.position.x, video.position.y, video.width, video.height, video.isOnline));
        }
    }

    buildImage(): void {
        for (let image of json.images) {
            this.ilv.pushImage(new Image(image.iid, image.startTime, image.duration, image.position.x, image.position.y, image.width, image.height, image.path, image.isOnline));
        }
    }

    buildSlide(): void {
        for (let slide of json.slides) {
            this.ilv.pushSlide(new Slide(slide.sid, slide.page, slide.name, slide.startTime, slide.duration));
        }
    }

    buildText(): void {
        for (let text of json.texts) {
            this.ilv.pushText(new Text(text.tid, text.content, text.startTime, text.duration, text.position.x, text.position.y, text.fontSize, text.fontColor, text.fontFamily));
        }
    }

    buildCustom(): void {
        for (let custom of json.customes) {
            this.ilv.pushCustom(new Custom(custom.cid, custom.path, custom.htmlContent, custom.startTime, custom.duration, custom.position.x, custom.position.y));
        }
    }

    buildFont(): void {
        for (let font of json.fonts) {
            this.ilv.pushFont(new Font(font.fid, font.path, font.isOnline, font.type));
        }
    }

    getFontsHTML(): Element {
        let fontStyleElement = document.createElement('style');
        for (let font of this.ilv.getFonts()) {
            if (font.isOnline) {
                fontStyleElement.innerHTML += `@import url('${font.path}');\n`;
            } 
            // else {
            //     fontStyleElement.innerHTML += `@import url('assests/font/${font.path.replace('.','')}.scss');\n`;
            // }
        }
        return fontStyleElement;
    }

    getContentNaviHTML(): Element {
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
            contentNavigation.innerHTML += `${slide.page}.<span class="content_item" id="TID_${slide.sid}"
            data-start-time="${slide.startTime}" 
            data-duration="${slide.duration}" 
            data-page="${slide.page}" 
            data-name="${slide.name}" 
            data-sid="${slide.sid}">${slide.name}</span> 
            (${secondFormatter(slide.startTime)})<br/>`;
        }

        return contentNavigation;
    }

    getCustomHTML(custom: Custom): Element {
        let _doc = new DOMParser().parseFromString(custom.htmlContent, 'text/html');
        let customElement = <HTMLDivElement>_doc.body.getElementsByClassName('customComponent')[0];
        customElement.setAttribute('style', `left: ${custom.position.x}px; top: ${custom.position.y}px;`);
        customElement.id = `TID_${custom.cid}`;
        customElement.dataset.duration = `${custom.duration}`;
        customElement.dataset.x = `${custom.position.x}`;
        customElement.dataset.y = `${custom.position.y}`;
        customElement.dataset.cid = `${custom.cid}`;
        customElement.dataset.path = `${custom.path}`;
        customElement.dataset.startTime = `${custom.startTime}`;

        return _doc.body.getElementsByClassName('customComponent')[0];
    }

    getTextHTML(text: Text): Element {
        let slideTextElement = document.createElement('span');
        slideTextElement.className = 'slideText';
        slideTextElement.setAttribute('style', `left: ${text.position.x}px; top: ${text.position.y}px; 
            font-size: ${text.fontSize}px; color: ${text.fontColor}; font-family: ${text.fontFamily}`);

        let slideTextSquare = document.createElement('span');
        slideTextSquare.className = 'slideTextSquare';

        let slideTextContent = document.createElement('span');
        slideTextContent.className = 'slideTextContent';

        let tempSpan = document.createElement('span');

        tempSpan.innerHTML = Marked(text.content);

        slideTextContent.appendChild(tempSpan);
        slideTextElement.appendChild(slideTextSquare);
        slideTextElement.appendChild(slideTextContent);
        slideTextElement.id = `TID_${text.tid}`;
        slideTextContent.dataset.duration = `${text.duration}`;
        slideTextContent.dataset.fontColor = `${text.fontColor}`;
        slideTextContent.dataset.fontSize = `${text.fontSize}`;
        slideTextContent.dataset.fontFamily = `${text.fontFamily}`;
        slideTextContent.dataset.x = `${text.position.x}`;
        slideTextContent.dataset.y = `${text.position.y}`;
        slideTextContent.dataset.startTime = `${text.startTime}`;
        slideTextContent.dataset.tid = `${text.tid}`;

        return slideTextElement;
    }

    getImageHTML(image: Image): Element {
        let imgElement = document.createElement('img');
        if (image.isOnline) {
            // console.log(image.path);
            imgElement.src = image.path;
        } else {
            imgElement.src = `assests/image/${image.path}`;
        }
        imgElement.height = image.height;
        imgElement.width = image.width;
        imgElement.setAttribute('style', `left: ${image.position.x}px; top: ${image.position.y}px;`);
        imgElement.id = `IID_${image.iid}`;
        imgElement.dataset.duration = `${image.duration}`;
        imgElement.dataset.height = `${image.height}`;
        imgElement.dataset.iid = `${image.iid}`;
        imgElement.dataset.isOnline = `${image.isOnline}`;
        imgElement.dataset.path = `${image.path}`;
        imgElement.dataset.x = `${image.position.x}`;
        imgElement.dataset.y = `${image.position.y}`;
        imgElement.dataset.startTime = `${image.startTime}`;
        imgElement.dataset.width = `${image.width}`;

        return imgElement;
    }

    getVideoHTML(video: Video): Element {
        let objectElement = undefined;

        if (video.isOnline) {
            objectElement = document.createElement('object');
            objectElement.data = video.path;
            objectElement.id = `VID_${video.vid}`;
            objectElement.width = `${video.width}px`;
            objectElement.height = `${video.height}px`;
        } else {
            objectElement = document.createElement('video');
            objectElement.src = "assests/video/" + video.path;
            objectElement.controls = 'controls';
            objectElement.autoplay = false;
            objectElement.id = `VID_${video.vid}`;
            objectElement.width = video.width;
            objectElement.height = video.height;
        }

        objectElement.dataset.vid = `${video.vid}`;
        objectElement.dataset.duration = `${video.duration}`;
        objectElement.dataset.height = `${video.height}`;
        objectElement.dataset.path = `${video.path}`;
        objectElement.dataset.isOnline = `${video.isOnline}`;
        objectElement.dataset.x = `${video.position.x}`;
        objectElement.dataset.y = `${video.position.y}`;
        objectElement.dataset.startTime = `${video.startTime}`;
        objectElement.dataset.width = `${video.width}`;

        return objectElement;
    }

    getFooter(): any {
        return {
            intitution: 'Hochschule Hannover',
            info1: json.course + ' ' + json.title + ' ' + json.semester,
            info2: json.chapter,
            lecturer: json.author,
            page: 'Seite ' + json.slides[0].page
        };
    }
}

export default Converter;