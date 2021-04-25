import Event from './Event';
import { Howl, Howler } from 'howler';

class ClosedCaptionEvent extends Event {
    value: boolean;

    constructor(timestamp: number, emitter: any, value: boolean) {
        super(timestamp, emitter);
        this.value = value;
    }

    getValue(): boolean {
        return this.value;
    }

}

export default ClosedCaptionEvent;