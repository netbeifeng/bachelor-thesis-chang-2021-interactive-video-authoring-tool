import Event from './Event';

class PIXIStageInitEvent extends Event {


    constructor(timestamp: number, emitter: any) {
        super(timestamp, emitter);
    }


}

export default PIXIStageInitEvent;