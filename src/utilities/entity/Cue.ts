class Cue {
    id: number;
    start: number;
    end: number;
    text: String;

    constructor(id: number, start: number, end: number, text: String) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.text = text;
    }

    getId() {
        return this.id;
    }

    getStart() {
        return this.start;
    }

    getEnd() {
        return this.end;
    }

    getText() {
        return this.text;
    }
}

export default Cue;