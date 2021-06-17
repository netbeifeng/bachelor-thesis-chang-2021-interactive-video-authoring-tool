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
        imgElement.src = this.path;
        if (!this.isOnline) {
            imgElement.src = "assets/image/" + this.path;
        }
        // setPosition(this.position.x, this.position.y);
        if (~~this.position.x == this.position.x && ~~this.position.y == this.position.y && (this.position.x > 1 && this.position.y > 1)) {
            imgElement.setAttribute('style', `left: ${this.position.x}px; top: ${this.position.y}px; z-index: ${this.zIndex};`);
        } else {
            imgElement.setAttribute('style', `left: ${this.position.x * 100}%; top: ${this.position.y * 100}%; z-index: ${this.zIndex};`);
        }
        if (this.width > 0 && this.height > 0) {
            // setWidthAndHeight(this.width, this.height);
            if (~~this.width == this.width && ~~this.height == this.height && (this.width > 1 && this.height > 1)) {
                imgElement.style.height = this.height + 'px';
                imgElement.style.width = this.width + 'px';
            } else {
                imgElement.style.height = this.height * 100 + '%';
                imgElement.style.width = this.width * 100 + '%';
            }
        }
        imgElement.id = `IID_${this.iid}`;
        imgElement.style.opacity = '0';
        imgElement.style.visibility = 'hidden';
        return imgElement;
    }
}

export default Image;