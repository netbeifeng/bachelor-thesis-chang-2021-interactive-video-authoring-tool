import Animation from "../Animation/Animation";
import Element from "./Element";

class Custom extends Element {
    cid: number;
    path: string;
    htmlContent: string;
    scriptText: string;


    constructor(cid: number, path: string, emphasisTime: number, htmlContent: string, startTime: number, duration: number, positionX: number, positionY: number, zIndex: number) {
        super(startTime, duration, emphasisTime, positionX, positionY, zIndex);
        this.cid = cid;
        this.path = path;
        this.htmlContent = htmlContent;
    }

    getID(): string {
        return `CID_${this.cid}`;
    }

    getHTMLElement(): HTMLElement {
        let _doc = new DOMParser().parseFromString(this.htmlContent, 'text/html');
        let customElement = <HTMLDivElement>_doc.body.getElementsByClassName('customComponent')[0];
        customElement.style.zIndex = `${this.zIndex}`;
        let beautify = require('js-beautify').js;
        let oldScript = customElement.getElementsByTagName('script')[0];
        this.scriptText = beautify(oldScript.innerHTML, { indent_size: 2, space_in_empty_paren: true });
        customElement.removeChild(oldScript);

        customElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px;`);
        customElement.id = `CID_${this.cid}`;
        customElement.style.opacity = '0';
        customElement.style.visibility = 'hidden';
        // customElement.dataset.duration = `${custom.duration}`;
        // customElement.dataset.x = `${custom.position.x}`;
        // customElement.dataset.y = `${custom.position.y}`;
        // customElement.dataset.cid = `${custom.cid}`;
        // customElement.dataset.path = `${custom.path}`;
        // customElement.dataset.startTime = `${custom.startTime}`;

        return customElement;
    }

    getScriptTagHTML(): HTMLElement {
        let newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.innerHTML = this.scriptText;
        newScript.dataset.belongTo = `CID_${this.cid}`;
        // eval(newScriptText);
        // customElement.appendChild(newScript);
        return newScript;
    }
}

export default Custom;