import Event from './Event';

class HowlerResumeEvent extends Event {

    constructor(timestamp: number, emitter: any) {
        super(timestamp, emitter);
    }

}

export default HowlerResumeEvent;