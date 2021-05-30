class Font {
    fid: number;
    path: string;
    isOnline: boolean;

    constructor(fid: number, path: string, isOnline: boolean) {
        this.fid = fid;
        this.path = path;
        this.isOnline = isOnline;
    }
}

export default Font;