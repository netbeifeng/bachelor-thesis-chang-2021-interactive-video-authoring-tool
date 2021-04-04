import Position from './Position';

class Element {
    startTime: number;
    duration: number;
    position: Position;

    constructor(startTime: number, duration: number, positionX: number, positionY: number) {
        // console.log(startTime);
        
        this.startTime = startTime;
        this.duration = duration;
        this.position = new Position(positionX, positionY);
    }
}

export default Element;