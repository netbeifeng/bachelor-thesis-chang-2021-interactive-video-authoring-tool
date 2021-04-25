import Element from "./Element";

class Graphics extends Element {
    gid: number;
    width: number;
    height: number;
    type: string;
    strokeWidth: number;
    strokeColor: string;

    constructor(gid: number, startTime: number, duration: number, positionX: number, positionY: number, width: number, height: number, type: string, strokeWidth: number, strokeColor: string, zIndex: number) {
        super(startTime, duration, positionX, positionY, zIndex);
        this.startTime = startTime;
        this.gid = gid;
        this.type = type;
        this.width = width;
        this.height = height;
        this.strokeColor = strokeColor;
        this.strokeWidth = strokeWidth;
    }

    getID(): string {
        return `GID_${this.gid}`;
    }

    getHTMLElement(): HTMLElement {
        let graphicsElement = document.createElement('div');
        graphicsElement.className = 'slideGraphics';
        graphicsElement.id = `GID_${this.gid}`;
        graphicsElement.style.zIndex = `${this.zIndex}`;
        graphicsElement.style.left = this.position.x + 'px';
        graphicsElement.style.top = this.position.y + 'px';
        graphicsElement.style.width = this.width + 'px';
        graphicsElement.style.height = this.height + 'px';
        graphicsElement.style.border = `${this.strokeWidth}px ${this.strokeColor} solid`;
        if(this.type == 'circle') {
            graphicsElement.style.borderRadius = (this.width / 2) + 'px';
        }
        graphicsElement.style.opacity = '0';
        graphicsElement.style.visibility = 'hidden';
        return graphicsElement;
    }
}

export default Graphics;