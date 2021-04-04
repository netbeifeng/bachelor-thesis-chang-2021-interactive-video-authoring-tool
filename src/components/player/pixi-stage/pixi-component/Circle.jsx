import { Graphics } from 'pixi.js';
import { PixiComponent } from '@inlet/react-pixi';

export default PixiComponent('Circle', {
    create: props => {
        return new Graphics()
    },
    didMount: (instance, parent) => {
        // apply custom logic on mount
    },
    willUnmount: (instance, parent) => {
        // clean up before removal
    },
    applyProps: (instance, oldProps, newProps) => {
        const { circleType, fill, x, y, radius, lineColor, lineWidth, lineAlpha, interactive } = newProps
        instance.clear()
        instance.lineStyle(lineWidth, lineColor, lineAlpha)
        instance.beginFill(fill)
        instance.drawCircle(x, y, radius)
        instance.endFill();
        instance.circleType = circleType;

        if (interactive) {
            instance.interactive = true;
            instance.buttonMode = true;

            if(circleType == 1) {
                instance.pointerover = () => {
                    instance.clear();
                    instance.beginFill(0xffffff, 1)
                        .lineStyle(lineWidth + 2, 0x0, lineAlpha)
                        .drawCircle(x, y, radius)
                        .endFill();
                    instance.children[0].style.fill = 0x0;
                }
    
                instance.pointerout = () => {
                    instance.clear()
                    instance.lineStyle(lineWidth, lineColor, lineAlpha)
                    instance.beginFill(fill)
                    instance.drawCircle(x, y, radius)
                    instance.endFill();
                    instance.children[0].style.fill = 0xffffff;
                }
    
                instance.pointerdown = () => {
                    for (let child of instance.parent.children) {
                        if (child.type == 1) {
                            child.zIndex = 1;
                            child.bin = true;
                            child.clear();
                            child.lineStyle(2, 0xdc3c05);
                            // console.log(child);
                            if (child.color.gray <= 128) {
                                child.beginFill(0x0)
                                getCellByRowCol(instance.parent, child.row, child.col).children[0].text = 0;
                            } else {
                                child.beginFill(0xffffff)
                                getCellByRowCol(instance.parent, child.row, child.col).children[0].text = 1;
                            }
                            child.drawRoundedRect(0, 0, 100, 100, 0)
                            child.position.set(child.x, child.y);
                            child.endFill();
                        }
                    }
                    if(instance.parent.slider) {
                        instance.parent.removeChild(instance.parent.slider);
                    }
                    instance.parent.sortChildren();
                }
            } else if(circleType == 2) {
                instance.pointerover = () => {
                    instance.clear();
                    instance.beginFill(0xffffff, 1)
                        .lineStyle(lineWidth + 2, 0x888888, lineAlpha)
                        .drawCircle(x, y, radius)
                        .endFill();
                    instance.children[0].style.fill = 0x888888;
                }

                instance.pointerout = () => {
                    instance.clear()
                    instance.lineStyle(lineWidth, lineColor, lineAlpha)
                    instance.beginFill(fill)
                    instance.drawCircle(x, y, radius)
                    instance.endFill();
                    instance.children[0].style.fill = 0xffffff;
                }
    
                instance.pointerdown = () => {
                    for (let child of instance.parent.children) {
                        if (child.type == 1 && child.bin) {
                            child.zIndex = 1;
                            child.bin = false;
                            child.clear();
                            child.lineStyle(2, 0x0)
                            child.beginFill(child.color.hex);
                            child.drawRoundedRect(0, 0, 100, 100, 0);
                            child.position.set(child.x, child.y);
                            child.endFill();
                            getCellByRowCol(instance.parent, child.row, child.col).children[0].text = child.color.gray;
                        }
                    }
                    instance.parent.sortChildren();
                }
            }


            var getCellByRowCol = (parent, row, col) => {
                for (let child of parent.children) {
                    if (child.type == 2 && child.row == row && child.col == col) {
                        return child;
                    }
                }
            }
        }
    },
})
