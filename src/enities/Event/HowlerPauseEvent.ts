import Event from './Event';

class HowlerPauseEvent extends Event {

    constructor(timestamp: number, emitter: any) {
        super(timestamp, emitter);
    }

}

export default HowlerPauseEvent;