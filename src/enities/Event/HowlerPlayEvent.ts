import Event from './Event';

class HowlerPlayEvent extends Event {
    track: number;

    constructor(timestamp: number, emitter: any, track: number) {
        super(timestamp, emitter);
        this.track = track;
    }

    getTrack(): number {
        return this.track;
    }

}

export default HowlerPlayEvent;