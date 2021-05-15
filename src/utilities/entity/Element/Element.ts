import Animation from '../Animation/Animation';
import Position from './Position';

abstract class Element {
    startTime: number;
    duration: number;
    position: Position;
    transformation: Array<Animation> = [];
    zIndex: number;
    painted: boolean;

    constructor(startTime: number, duration: number, positionX: number, positionY: number, zIndex: number) {
        this.startTime = startTime;
        this.duration = duration;
        this.position = new Position(positionX, positionY);
        this.zIndex = zIndex;
    }


    pushTransformation(transformation: Animation): void{
        this.transformation.push(transformation);
    }

    paint(): void {
        document.getElementById('htmlInteractionLayer').append(this.getHTMLElement());
        this.painted = true;
    }

    abstract getID(): string;

    abstract getHTMLElement(): HTMLElement;
}

export default Element;