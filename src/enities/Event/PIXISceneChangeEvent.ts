import Event from './Event';

class PIXISceneChangeEvent extends Event {
    scene: number;
    proactiveBack: boolean = false;

    constructor(timestamp: number, emitter: any, scene: number, proactiveBack?: boolean) {
        super(timestamp, emitter);
        this.scene = scene;
        this.proactiveBack = proactiveBack;
    }

    getScene(): number {
        return this.scene;
    }

    getProactiveBack(): boolean {
        return this.proactiveBack;
    }
}

export default PIXISceneChangeEvent;