import Event from './Event';
import { Howl, Howler } from 'howler';

class ClosedCaptionEvent extends Event {
    playIndex: number;
    value: boolean;
    howler: Howl;
    event: string;

    constructor(timestamp: number, emitter: any, playIndex: number, value: boolean, howler: Howl, event: string) {
        super(timestamp, emitter);
        this.playIndex = playIndex;
        this.value = value;
        this.howler = howler;
    }

    getPlayIndex(): number {
        return this.playIndex;
    }

    getValue(): boolean {
        return this.value;
    }

    getHowler(): Howl {
        return this.howler;
    }
}

export default ClosedCaptionEvent;