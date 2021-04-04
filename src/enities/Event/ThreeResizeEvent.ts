import Event from './Event';

class ThreeResizeEvent extends Event {

    constructor(timestamp: number, emitter: any) {
        super(timestamp, emitter);
    }

}

export default ThreeResizeEvent;