class Event {
    timestamp: number;
    emitter: any;

    constructor(timestamp: number, emitter: any) {
        this.timestamp = timestamp;
        this.emitter = emitter;
    }
}

export default Event;