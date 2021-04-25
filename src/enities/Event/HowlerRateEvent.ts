import Event from './Event';
import { Howl, Howler } from 'howler';

class HowlerRateEvent extends Event {
    rate: number;

    constructor(timestamp: number, emitter: any, rate: number) {
        super(timestamp, emitter);
        this.rate = rate;
    }
}

export default HowlerRateEvent;