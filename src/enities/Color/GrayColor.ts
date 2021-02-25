import Color from "./Color";

class GrayColor extends Color{
    gray: number;
    constructor(gray: number) {
        super();
        this.gray = gray;
        this.hex = parseInt("0x" + this.componentToHex(gray) + this.componentToHex(gray) + this.componentToHex(gray),16);
    }

    getGray(): number {
        return this.gray;
    }

    getGrayColor(): GrayColor {
        return this;
    }

    getHex(): number {
        return this.hex;
    }
}

export default GrayColor;