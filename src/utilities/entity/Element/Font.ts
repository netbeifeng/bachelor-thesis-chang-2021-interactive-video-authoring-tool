class Font {
    fid: number;
    path: string;
    isOnline: boolean;
    type: string;

    constructor(fid: number, path: string, isOnline: boolean, type: string) {
        this.fid = fid;
        this.path = path;
        this.isOnline = isOnline;
        this.type = type;
    }
}

export default Font;