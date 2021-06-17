class Font {
    fid: number;
    path: string;
    isGoogle: boolean;
    isLocal: boolean;

    constructor(fid: number, path: string, isGoogle: boolean, isLocal: boolean) {
        this.fid = fid;
        this.path = path;
        this.isGoogle = isGoogle;
        this.isLocal = isLocal;
    }
}

export default Font;