class FontStyle {
    color: number;
    fontSize: number;
    fontFamily: string;

    constructor(style: any) {
        this.color = parseInt(style.color);
        this.fontSize = style.fontSize;
        this.fontFamily = style.fontFamily;
    }

    getColor(): number {
        return this.color;
    }

    getFontSize(): number {
        return this.fontSize;
    }
    
    getFontFamily(): string {
        return this.fontFamily;
    }
}

export default FontStyle;