import Element from "./Element";

class Video extends Element {
    vid: number;
    path: string;
    width: number;
    height: number;
    isOnline: boolean;
    isYouTube: boolean;

    constructor(vid: number, path: string, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number, isOnline: boolean, isYouTube: boolean, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.vid = vid;
        this.path = path;
        this.width = width;
        this.height = height;
        this.isOnline = isOnline;
        this.isYouTube = isYouTube;
    }

    getID(): string {
        return `VID_${this.vid}`;
    }

    getHTMLElement(): HTMLElement {
        let objectElement: any;
        if (this.isYouTube) {
            objectElement = document.createElement('object');
            objectElement.data = this.path;
            objectElement.id = `VID_${this.vid}`;
            // objectElement.style.width = `${this.width}px`;
            // objectElement.style.height = `${this.height}px`;
            // if (~~this.width == this.width && ~~this.height == this.height && (this.width > 1 && this.height > 1)) {
            //     objectElement.style.height = this.height;
            //     objectElement.style.height = this.width;
            // } else {
            //     objectElement.style.height = this.height * 100 + '%';
            //     objectElement.style.width = this.width * 100 + '%';
            // }
        } else {
            objectElement = document.createElement('video');
            if (this.isOnline) {
                objectElement.src = this.path;
            } else {
                objectElement.src = "assets/video/" + this.path;
            }
            objectElement.controls = 'controls';
            objectElement.autoplay = false;
            objectElement.id = `VID_${this.vid}`;
            // if (~~this.width == this.width && ~~this.height == this.height && (this.width > 1 && this.height > 1)) {
            //     objectElement.style.height = this.height;
            //     objectElement.style.height = this.width;
            // } else {
            //     objectElement.style.height = this.height * 100 + '%';
            //     objectElement.style.width = this.width * 100 + '%';
            // }
        }
        if (~~this.position.x == this.position.x && ~~this.position.y == this.position.y && (this.position.x > 1 && this.position.y > 1)) {
            objectElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px; z-index: ${this.zIndex};`);
        } else {
            objectElement.setAttribute('style', `left: ${this.position.x * 100}%; top: ${this.position.y * 100}%; z-index: ${this.zIndex};`);
        }

        if (~~this.width == this.width && ~~this.height == this.height && (this.width > 1 && this.height > 1)) {
            objectElement.style.height = this.height + 'px';
            objectElement.style.width = this.width + 'px';
        } else {
            objectElement.style.height = this.height * 100 + '%';
            objectElement.style.width = this.width * 100 + '%';
        }
        objectElement.style.opacity = '0';
        objectElement.style.visibility = 'hidden';
        return objectElement;
    }
}

export default Video;