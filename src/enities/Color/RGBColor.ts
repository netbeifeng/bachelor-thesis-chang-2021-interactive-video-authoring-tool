import Color from "./Color";
import GrayColor from "./GrayColor";

class RGBColor extends Color {
    r: number;
    g: number;
    b: number;


    constructor(r?: number, g?: number, b?: number) {
        super();
        if (r && g && b) {
            this.r = r;
            this.g = g;
            this.b = b;
        } else {
            this.r = Math.floor(Math.random() * 256) * 0.299;
            this.g = Math.floor(Math.random() * 256) * 0.299;
            this.b = Math.floor(Math.random() * 256) * 0.114;
        }

        this.hex = parseInt("0x" + this.componentToHex(this.r) + this.componentToHex(this.g) + this.componentToHex(this.b), 16);
    }

    getHex(): number {
        return this.hex;
    }

    getColor(): RGBColor {
        return this;
    }

    getGrayColor(): GrayColor {
        let gary = Math.round(this.r + this.g + this.b);
        return new GrayColor(gary);
    }
}

export default RGBColor;