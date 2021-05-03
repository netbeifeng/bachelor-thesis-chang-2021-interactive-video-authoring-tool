import Element from "./Element";

class Custom extends Element {
    cid: number;
    path: string;
    htmlContent: string;
    scriptText: string;
    styleText: string;


    constructor(cid: number, path: string, htmlContent: string, startTime: number, duration: number, positionX: number, positionY: number, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.cid = cid;
        this.path = path;
        this.htmlContent = htmlContent;
    }

    paint(): void {
        document.getElementById('htmlInteractionLayer').append(this.getHTMLElement());
        document.body.append(this.getScriptTagHTML());
        document.body.append(this.getStyleTagHTML());
        this.painted = true;
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
        let oldStyle = customElement.getElementsByTagName('style')[0];
        this.scriptText = beautify(oldScript.innerHTML, { indent_size: 2, space_in_empty_paren: true });
        this.styleText = oldStyle.innerHTML;
        customElement.removeChild(oldScript);
        customElement.removeChild(oldStyle);

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
        return newScript;
    }

    getStyleTagHTML(): HTMLElement {
        let newStyle = document.createElement('style');
        newStyle.innerHTML = this.styleText;
        newStyle.dataset.belongTo = `CID_${this.cid}`;
        return newStyle;
    }
}

export default Custom;