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
        if (~~this.position.x == this.position.x && ~~this.position.y == this.position.y && (this.position.x > 1 && this.position.y > 1)) {
            graphicsElement.style.left = this.position.x + 'px';
            graphicsElement.style.top = this.position.y + 'px';
        } else {
            graphicsElement.style.left = this.position.x * 100 + '%';
            graphicsElement.style.top = this.position.y * 100 + '%';
        }
        
        if (~~this.width == this.width && ~~this.height == this.height && (this.width > 1 && this.height > 1)) {
            graphicsElement.style.width = this.width + 'px';
            graphicsElement.style.height = this.height + 'px';
        } else {
            graphicsElement.style.width = this.width * 100 + '%';
            graphicsElement.style.height = this.height * 100 + '%';
        }

        graphicsElement.style.border = `${this.strokeWidth}px ${this.strokeColor} solid`;
        if (this.type == 'circle') {
            graphicsElement.style.borderRadius = `${this.width / 2}px / ${this.height / 2}px`;
        }
        graphicsElement.style.opacity = '0';
        graphicsElement.style.visibility = 'hidden';
        return graphicsElement;
    }
}

export default Graphics;