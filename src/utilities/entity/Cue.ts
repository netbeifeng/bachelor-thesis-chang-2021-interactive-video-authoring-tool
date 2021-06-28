class Cue {
    id: string;
    start: number;
    end: number;
    text: string;

    constructor(id: string, start: number, end: number, text: string) {
        this.id = id;
        this.start = start;
        this.end = end;
        this.text = text;
    }

    getId(): string {
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