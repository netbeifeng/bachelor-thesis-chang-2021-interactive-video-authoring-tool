import Element from "./Element";

class Image extends Element {
    iid: number;
    isOnline: boolean;
    path: string;
    width: number;
    height: number;

    constructor(iid: number, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number, path: string, isOnline: boolean, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.iid = iid;
        this.path = path;
        this.isOnline = isOnline;
        this.width = width;
        this.height = height;
    }

    getID(): string {
        return `IID_${this.iid}`;
    }

    getHTMLElement(): HTMLElement {
        let imgElement = document.createElement('img');
        if (this.isOnline) {
            // console.log(image.path);
            imgElement.src = this.path;
        } else {
            imgElement.src = `assets/image/${this.path}`;
        }
        imgElement.height = this.height;
        imgElement.width = this.width;
        imgElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px; z-index: ${this.zIndex};`);
        imgElement.id = `IID_${this.iid}`;
        imgElement.style.opacity = '0';
        imgElement.style.visibility = 'hidden';
        // imgElement.dataset.duration = `${image.duration}`;
        // imgElement.dataset.height = `${image.height}`;
        // imgElement.dataset.iid = `${image.iid}`;
        // imgElement.dataset.isOnline = `${image.isOnline}`;
        // imgElement.dataset.path = `${image.path}`;
        // imgElement.dataset.x = `${image.position.x}`;
        // imgElement.dataset.y = `${image.position.y}`;
        // imgElement.dataset.startTime = `${image.startTime}`;
        // imgElement.dataset.width = `${image.width}`;

        return imgElement;
    }
}

export default Image;