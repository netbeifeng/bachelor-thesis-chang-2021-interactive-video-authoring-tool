import Element from "./Element";

class Custom extends Element {
    cid: number;
    path: string;
    htmlContent: string;
    scriptContent: string;
    styleContent: string;
    scriptSrc: any = new Array();
    scriptText: any[] = new Array();
    styleText: any[] = new Array();
    oncePlayed: boolean = false;

    // constructor(cid: number, path: string, htmlContent: string, scriptContent: string, styleContent: string, startTime: number, duration: number, width: number, height: number, positionX: number, positionY: number, zIndex: number) {
    constructor(cid: number, path: string, htmlContent: string, scriptContent: string, styleContent: string, startTime: number, duration: number, positionX: number, positionY: number, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.cid = cid;
        // this.width = width;
        // this.height = height;
        this.path = path;
        this.htmlContent = htmlContent;
        this.scriptContent = scriptContent;
        this.styleContent = styleContent;
    }

    paint(): void {
        let indicator = document.createElement('div');
        indicator.id = `CID_${this.cid}`;
        document.body.append(indicator);
        // if (this.type == "HTML") {
        document.getElementById('htmlInteractionLayer').append(this.getHTMLElement());

        for (let syElement of this.getStyleTagHTML()) {
            document.head.append(syElement);
        }
        for (let scElement of this.getScriptTagHTML()) {
            document.body.append(scElement);
        }

        // if(this.styleContent.length > 0) {
        //     let styleElement = document.createElement('style');
        //     styleElement.innerHTML = this.styleContent;
        //     document.head.append(styleElement);
        // }

        this.painted = true;
    }


    getID(): string {
        return `CID_${this.cid}`;
    }

    getHTMLElement(): HTMLElement {
        let _doc = new DOMParser().parseFromString(this.htmlContent, 'text/html');
        let customElement = <HTMLDivElement>_doc.body.getElementsByClassName('customComponent')[0];
        // console.log(customElement.style.zIndex);

        let beautify = require('js-beautify').js;
        let oldScript = customElement.getElementsByTagName('script');
        // console.log(oldScript.length);

        let oldStyle = customElement.getElementsByTagName('style');
        for (let sc of oldScript) {
            // console.log(sc, oldScript[0]);
            // console.log(sc, oldScript[1]);
            // console.log("waht");

            if (sc.src.length > 1) {
                // console.log("waht");
                this.scriptSrc.push({ src: sc.src, type: sc.type });
                // customElement.removeChild(sc);
            } else {
                this.scriptText.push({ content: beautify(sc.innerHTML, { indent_size: 2, space_in_empty_paren: true }), type: sc.type });
                // console.log("waht");
                // customElement.removeChild(sc);
            }
        }
        // console.log("waht");

        for (let sy of oldStyle) {
            this.styleText.push(sy.innerHTML);
            customElement.removeChild(sy);
        }

        customElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px;`);
        customElement.id = `CID_${this.cid}`;
        customElement.style.opacity = '0';
        customElement.style.visibility = 'hidden';
        customElement.style.zIndex = `${this.zIndex}`;

        // customElement.dataset.duration = `${custom.duration}`;
        // customElement.dataset.x = `${custom.position.x}`;
        // customElement.dataset.y = `${custom.position.y}`;
        // customElement.dataset.cid = `${custom.cid}`;
        // customElement.dataset.path = `${custom.path}`;
        // customElement.dataset.startTime = `${custom.startTime}`;

        return customElement;
    }

    getScriptTagHTML(): HTMLElement[] {
        let scriptCollection = [];
        // console.log(this.scriptText);
        for (let sc of this.scriptSrc) {
            let newScript = document.createElement('script');
            if (sc.type == 'module') {
                newScript.type = 'module';
            } else {
                newScript.type = 'text/javascript';
            }
            newScript.src = sc.src;
            newScript.dataset.belongTo = `CID_${this.cid}`;
            scriptCollection.push(newScript);
        }


        for (let sc of this.scriptText) {
            let newScript = document.createElement('script');
            if (sc.type == 'module') {
                newScript.type = 'module';
            } else {
                newScript.type = 'text/javascript';
            }
            newScript.innerHTML = sc.content;
            newScript.dataset.belongTo = `CID_${this.cid}`;
            scriptCollection.push(newScript);
        }

        return scriptCollection;
    }

    getScriptTagHTMLOfJS(): HTMLElement {
        let newScript = document.createElement('script');
        newScript.type = 'text/javascript';
        newScript.innerHTML = this.scriptContent;
        newScript.dataset.belongTo = `CID_${this.cid}`;
        return newScript;
    }

    getStyleTagHTMLOfCSS(): HTMLElement {
        let newStyle = document.createElement('style');
        newStyle.innerHTML = this.styleContent;
        newStyle.dataset.belongTo = `CID_${this.cid}`;
        return newStyle;
    }

    getStyleTagHTML(): HTMLElement[] {
        let styleCollection = [];
        for (let sy of this.styleText) {
            let newStyle = document.createElement('style');
            newStyle.innerHTML = sy;
            newStyle.dataset.belongTo = `CID_${this.cid}`;
            styleCollection.push(newStyle);
        }
        return styleCollection;
    }
}

export default Custom;