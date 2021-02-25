abstract class Color {
    hex: number;
    getHex() {};
    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }
}

export default Color;