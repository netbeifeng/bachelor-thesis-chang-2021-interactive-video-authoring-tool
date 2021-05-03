import Custom from "./Custom";
import Element from "./Element";

class Text extends Element {
    tid: number;
    content: string;
    fontSize: number = 26;
    fontColor: string = '#000000';
    fontFamily: string = 'Arial, Helvetica, sans-serif';
    markdownRender: any = require('markdown-it')().use(require('markdown-it-highlightjs'), { inline: true }).use(require('markdown-it-katex')).use(require('markdown-it-task-lists'));

    constructor(tid: number, content: string, startTime: number, duration: number, positionX: number, positionY: number, fontSize: number, fontColor: string, fontFamily: string, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.startTime = startTime;
        this.tid = tid;
        this.content = content;
        this.fontSize = fontSize;
        this.fontColor = fontColor;
        this.fontFamily = fontFamily;
    }

    getID(): string {
        return `TID_${this.tid}`;
    }

    getHTMLElement(): HTMLElement {
        let slideTextElement = document.createElement('span');
        slideTextElement.className = 'slideText';
        slideTextElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px; z-index: ${this.zIndex};`);
        let slideTextSquare = document.createElement('span');

        let slideTextContent = document.createElement('span');
        slideTextContent.className = 'slideTextContent';

        let tempSpan = document.createElement('span');
        tempSpan.setAttribute('style', `font-size: ${this.fontSize}px; color: ${this.fontColor}; font-family: ${this.fontFamily};`);
        tempSpan.innerHTML = this.markdownRender.render(this.content);
        // highlight: function (code, lang) {
        //     return hljs.highlightAuto(code).value;
        // }});

        slideTextContent.appendChild(tempSpan);
        if (this.tid < 9e2) {
            slideTextSquare.className = 'slideTextSquare';
            slideTextElement.appendChild(slideTextSquare);
        }
        slideTextElement.appendChild(slideTextContent);
        slideTextElement.id = `TID_${this.tid}`;
        slideTextElement.style.opacity = '0';
        slideTextElement.style.visibility = 'hidden';

        // slideTextContent.dataset.duration = `${text.duration}`;
        // slideTextContent.dataset.fontColor = `${text.fontColor}`;
        // slideTextContent.dataset.fontSize = `${text.fontSize}`;
        // slideTextContent.dataset.fontFamily = `${text.fontFamily}`;
        // slideTextContent.dataset.x = `${text.position.x}`;
        // slideTextContent.dataset.y = `${text.position.y}`;
        // slideTextContent.dataset.startTime = `${text.startTime}`;
        // slideTextContent.dataset.tid = `${text.tid}`;

        return slideTextElement;

    }
}

export default Text;