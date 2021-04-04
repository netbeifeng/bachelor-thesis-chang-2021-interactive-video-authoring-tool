import json from '../../assests/build.json';
import ILV from './entity/ILV';
import Slide from './entity/Slide';
import * as Marked from 'marked';
import Text from './entity/Text';
import Custom from './entity/Custom';
import Image from './entity/Image';

class Converter {
    ilv: ILV;

    constructor() {
        this.ilv = new ILV(json.title, json.course, json.chapter, json.author, json.semester, json.audio, json.subtitle);
        this.buildSlide();
        this.buildText();
        this.buildCustom();
        this.buildImage();
    }

    getILV(): ILV {
        return this.ilv;
    }

    buildImage(): void {
        for(let image of json.images) {
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
            this.ilv.pushText(new Text(text.tid, text.content, text.startTime, text.duration, text.position.x, text.position.y, text.fontSize, text.fontColor));
        }
    }

    buildCustom(): void  {
        for (let custom of json.customes) {
            this.ilv.pushCustom(new Custom(custom.cid, custom.path, custom.htmlContent, custom.startTime, custom.duration, custom.position.x, custom.position.y));
        }
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
            contentNavigation.innerHTML += `${slide.page}.<span class="content_item">${slide.name}</span> (${secondFormatter(slide.startTime)})<br/>`;
        }

        return contentNavigation;
    }

    getCustomHTML(custom: Custom): Element {
        let _doc = new DOMParser().parseFromString(custom.htmlContent, 'text/html');
        _doc.body.getElementsByClassName('customComponent')[0].setAttribute('style', `left: ${custom.position.x}px; top: ${custom.position.y}px;`);
        return _doc.body.getElementsByClassName('customComponent')[0];
    }

    getTextHTML(text: Text): Element {
        let slideText = document.createElement('span');
        slideText.className = 'slideText';
        slideText.setAttribute('style', `left: ${text.position.x}px; top: ${text.position.y}px; font-size: ${text.fontSize}px; color: ${text.fontColor}`);

        let slideTextSquare = document.createElement('span');
        slideTextSquare.className = 'slideTextSquare';

        let slideTextContent = document.createElement('span');
        slideTextContent.className = 'slideTextContent';

        let tempSpan = document.createElement('span');

        tempSpan.innerHTML = Marked(text.content);

        slideTextContent.appendChild(tempSpan);
        slideText.appendChild(slideTextSquare);
        slideText.appendChild(slideTextContent);
        return slideText;
    }

    getImageHTML(image: Image): Element {
        let img = document.createElement('img');
        if(image.isOnline) {
            console.log(image.path);
            
            img.src = image.path;
        } else {
            img.src = `assests/image/${image.path}`;
        }
        img.height = image.height;
        img.width = image.width;
        img.setAttribute('style', `left: ${image.position.x}px; top: ${image.position.y}px;`);
        return img;
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