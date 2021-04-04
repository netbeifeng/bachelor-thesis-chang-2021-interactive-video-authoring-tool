import Event from './Event';

class HowlerSeekEvent extends Event {
    seek: number;

    constructor(timestamp: number, emitter: any, seek: number) {
        super(timestamp, emitter);
        this.seek = seek;
    }

    getSeek(): number {
        return this.seek;
    }

}

export default HowlerSeekEvent;