import Event from './Event';
import { Howl, Howler } from 'howler';

class HowlerLoadEvent extends Event {
    track: number;
    howler: Howler;

    constructor(timestamp: number, emitter: any, howler: Howler) {
        super(timestamp, emitter);
        this.howler = howler;
    }

    getTrack(): number {
        return this.track;
    }

}

export default HowlerLoadEvent;