import Element from "./Element";

class Video extends Element {
    vid: number;
    path: string;
    width: number;
    height: number;
    isOnline: boolean;

    constructor(vid: number, path: string, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number, isOnline: boolean, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.vid = vid;
        this.path = path;
        this.width = width;
        this.height = height;
        this.isOnline = isOnline;
    }

    getID(): string {
        return `VID_${this.vid}`;
    }

    getHTMLElement(): HTMLElement {
        let objectElement: any;

        if (this.isOnline) {
            objectElement = document.createElement('object');
            objectElement.data = this.path;
            objectElement.id = `VID_${this.vid}`;
            objectElement.width = `${this.width}px`;
            objectElement.height = `${this.height}px`;
        } else {
            objectElement = document.createElement('video');
            objectElement.src = "assets/video/" + this.path;
            objectElement.controls = 'controls';
            objectElement.autoplay = false;
            objectElement.id = `VID_${this.vid}`;
            objectElement.width = this.width;
            objectElement.height = this.height;
        }
        objectElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px; z-index: ${this.zIndex};`);

        objectElement.style.opacity = '0';
        objectElement.style.visibility = 'hidden';

        // objectElement.dataset.vid = `${video.vid}`;
        // objectElement.dataset.duration = `${video.duration}`;
        // objectElement.dataset.height = `${video.height}`;
        // objectElement.dataset.path = `${video.path}`;
        // objectElement.dataset.isOnline = `${video.isOnline}`;
        // objectElement.dataset.x = `${video.position.x}`;
        // objectElement.dataset.y = `${video.position.y}`;
        // objectElement.dataset.startTime = `${video.startTime}`;
        // objectElement.dataset.width = `${video.width}`;

        return objectElement;
    }
}

export default Video;