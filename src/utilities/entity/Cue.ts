class Cue {
    id: number;
    start: number;
    end: number;
    text: string;

    constructor(id: number, start: number, end: number, text: string) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.text = text;
    }

    getId(): number {
        return this.id;
    }

    getStart(): number {
        return this.start;
    }

    getEnd(): number {
        return this.end;
    }

    getText(): string {
        return this.text;
    }
}

export default Cue;