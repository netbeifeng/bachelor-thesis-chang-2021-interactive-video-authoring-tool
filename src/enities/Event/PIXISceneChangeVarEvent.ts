import Event from './Event';
import { Howl, Howler } from 'howler';

class PIXISceneChangeVarEvent extends Event {
    scene: number;
    howler: Howl;

    constructor(timestamp: number, emitter: any, scene: number, howler: Howl) {
        super(timestamp, emitter);
        this.scene = scene;
        this.howler = howler;
    }

    getScene(): number {
        return this.scene;
    }

    getHowler(): Howl {
        return this.howler;
    }
}

export default PIXISceneChangeVarEvent;