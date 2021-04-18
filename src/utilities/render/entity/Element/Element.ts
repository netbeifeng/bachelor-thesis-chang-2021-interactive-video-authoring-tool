import Animation from '../Animation/Animation';
import Position from './Position';

abstract class Element {
    startTime: number;
    duration: number;
    position: Position;
    emphasisTime: number;
    transformation: Array<Animation> = [];
    zIndex: number;

    constructor(startTime: number, duration: number, emphasisTime: number, positionX: number, positionY: number, zIndex: number) {
        // console.log(startTime);
        this.startTime = startTime;
        this.emphasisTime = emphasisTime;
        this.duration = duration;
        this.position = new Position(positionX, positionY);
        this.zIndex = zIndex;
    }


    pushTransformation(transformation: Animation): void{
        this.transformation.push(transformation);
    }

    abstract getID(): string;

    abstract getHTMLElement(): HTMLElement;
}

export default Element;