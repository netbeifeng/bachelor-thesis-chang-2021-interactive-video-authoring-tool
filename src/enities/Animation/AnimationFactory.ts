import Point from './Point';
import animation_map_1 from '../../assests/demo_1/animation_map_1.json';
import Animation from './Animation';
import AnimationEnum from './AnimationEnum';
import CursorMove from './CursorMove';
import DrawLine from './DrawLine';
import DrawCircle from './DrawCircle';
import * as PIXI from 'pixi.js';
import MotionPathPlugin from 'gsap/MotionPathPlugin';
import Scale from './Scale';
import { TimelineMax, TweenMax, gsap } from 'gsap/all';

import PixiPlugin from 'gsap/PixiPlugin';
import Slide from './Slide';
import DrawSprite from './DrawSprite';
import DrawText from './DrawText';
import FontStyle from './FontStyle';
import DrawQuestionBlockTypeOne from './DrawQuestionBlockTypeOne';
import GlobalVar from '../../utilities/GlobalVar';

class AnimationFactory {
    animationMap: Map<number, Animation>;
    parent: PIXI.Container;
    cursor: PIXI.Sprite;
    timeline: TimelineMax;

    constructor(scene: number, parent: PIXI.Container) {
        // console.log();
        this.animationMap = new Map();
        this.parent = parent;
        this.cursor = this.getSprite('imgs/cursor.png', 36.4, 54.6, new Point(-155, 820));
        this.cursor.name = 'cursor';
        this.cursor.alpha = 1;
        this.cursor.zIndex = 10;
        this.parent.parent.name = 'superContainer';
        this.parent.name = 'matrixContainer';
        this.parent.parent.addChild(this.cursor);
        // console.log(this.parent.parent.name);

        switch (scene) {
            case 1: {
                gsap.registerPlugin(MotionPathPlugin);
                gsap.registerPlugin(PixiPlugin);
                PixiPlugin.registerPIXI(PIXI);
                let array = Array.from(animation_map_1);
                for (let item of array) {
                    let animation = this.getConcreteAnimation(item);
                    this.animationMap.set(item.id, animation);
                }
                break;
            }
            case 2: {
                console.log('loading');
            }
        }
        this.generateTimeline(this.animationMap);
    }

    getTimeline(): TimelineMax {
        return this.timeline;
    }

    getAnimationMap(): Map<number, Animation> {
        return this.animationMap;
    }

    generateTimeline(map: Map<number, Animation>) {
        this.timeline = new TimelineMax();
        this.timeline.addLabel("start", 0);
        for (let animation of map.values()) {
            animation.animate(this.timeline);
        }
    }

    getConcreteAnimation(item: any): Animation {
        let animation = undefined;
        if (item.isInSub) {
            if (item.typeID == AnimationEnum.Slide && item.isCursor) {
                animation = this.generateAnimation(item, this.parent, this.cursor);
            } else {
                animation = this.generateAnimation(item, this.parent);
            }
        } else {
            if (item.typeID == AnimationEnum.Slide && item.isCursor) {
                animation = this.generateAnimation(item, this.parent.parent, this.cursor);
            } else {
                animation = this.generateAnimation(item, this.parent.parent);
            }
        }
        return animation;
    }

    generateAnimation(item, parent, object?): Animation {
        if (object) { parent = object; } // use self as parent object for slide animation and scale animation
        switch (item.typeID) {
            case 1: {
                return new CursorMove(item.id, AnimationEnum.CursorMove, this.getSprite('imgs/cursor.png', 36.4, 54.6, new Point(item.x, item.y)), parent, item.startTime, item.duration, new Point(item.x, item.y), item.offsetX, item.offsetY);
            }

            case 2: {
                return new DrawCircle(item.id, AnimationEnum.DrawCircle, this.getCircle(item.x, item.y, item.radius), parent, item.startTime, item.duration, new Point(item.x, item.y), item.radius);
            }

            case 3: {
                return new DrawLine(item.id, AnimationEnum.DrawLine, this.getLine(item.startPoint, item.endPoint, item.arrow, item.direction), parent, item.startTime, item.duration, new Point(item.startPoint.x, item.startPoint.y), new Point(item.endPoint.x, item.endPoint.y), item.arrow, item.direction);
            }

            case 4: {
                return new DrawText(item.id, AnimationEnum.DrawText, this.getText(item.text, new FontStyle(item.style)), parent, item.startTime, item.duration, new FontStyle(item.style), new Point(item.x, item.y));
            }

            case 5: {
                return new DrawSprite(item.id, AnimationEnum.DrawSprite, this.getSprite(item.path, item.width, item.height, new Point(item.x, item.y)), parent, item.startTime, item.duration, item.width, item.height, new Point(item.x, item.y));
            }

            case 6: {
                return new DrawQuestionBlockTypeOne(item.id, AnimationEnum.DrawQuestionBlockTypeOne, this.getQuestionBlockType1(item.question, item.tip), parent, item.startTime, item.duration, new Point(item.x, item.y), item.question, item.tip, item.tipImgPath);
            }

            case -1: {
                return new Slide(item.id, AnimationEnum.Slide, parent, null, item.startTime, item.duration, new Point(item.x, item.y));
            }

            case -2: {
                return new Scale(item.id, AnimationEnum.Scale, parent, null, item.startTime, item.duration, item.scaleX, item.scaleY);
            }
        }
    }

    getSprite(path: string, width: number, height: number, point: Point): PIXI.Sprite {
        let t_sprite = PIXI.Texture.from(path);
        let sprite = new PIXI.Sprite(t_sprite);
        sprite.width = width;
        sprite.height = height;
        sprite.x = point.x;
        sprite.y = point.y;
        sprite.alpha = 0;
        return sprite;
    }

    getCircle(x, y, radius): PIXI.Graphics {
        let circle = new PIXI.Graphics()
            .lineStyle(4, 0xb22222, 1)
            .drawCircle(x, y, radius);
        circle.alpha = 0;
        return circle;
    }

    getLine(startPoint, endPoint, arrow, direction): PIXI.Graphics {
        let line = new PIXI.Graphics()
            .lineStyle(4, 0xb22222, 1)
            .moveTo(0, 0);
        line.moveTo(startPoint.x, startPoint.y)
            .lineTo(endPoint.x, endPoint.y);
        if (arrow) {
            if (direction == 'v') {
                line
                    .moveTo(endPoint.x, endPoint.y)
                    .lineTo(endPoint.x + 10, endPoint.y - 10)
                    .moveTo(endPoint.x, endPoint.y)
                    .lineTo(endPoint.x - 10, endPoint.y - 10)
            } else {
                line
                    .moveTo(endPoint.x, endPoint.y)
                    .lineTo(endPoint.x - 10, endPoint.y - 10)
                    .moveTo(endPoint.x, endPoint.y)
                    .lineTo(endPoint.x - 10, endPoint.y + 10)
            }
        }
        line.alpha = 0;
        return line;
    }

    getText(content: string, style?: FontStyle): PIXI.Text {
        let text = new PIXI.Text(content, { fill: style.getColor(), fontSize: style.getFontSize(), fontFamily: style.getFontFamily() });
        text.alpha = 0;
        return text;
    }

    getQuestionBlockType1(question: string, tip: string): PIXI.Container {
        let question_description = "";
        let options = [];
        let width = 520;
        let height = 290;

        if (question.includes("f(r,c)=?")) {
            let getRandomArrayElements = (arr, count) => {
                var shuffled = arr.slice(0),
                    i = arr.length,
                    min = i - count,
                    temp,
                    index;
                while (i-- > min) {
                    index = Math.floor((i + 1) * Math.random());
                    temp = shuffled[index];
                    shuffled[index] = shuffled[i];
                    shuffled[i] = temp;
                }
                return shuffled.slice(min);
            };
            options = getRandomArrayElements(GlobalVar.grayMatrix, 3);
            let answer_index = Math.floor(Math.random() * 3);
            let answer_key = options[answer_index];
            options[answer_index].answer = true;
            question_description = `f(${answer_key.row},${answer_key.col}) = ?`;
        } else if (question.includes("f(1.5,2.5)=sinnvoll?")) {
            question_description = "f(1.5, 2.5) = ?";

            let getArrayElementByRowCol = (arr, row, col) => {
                for (let item of arr) {
                    if (item.col == col && item.row == row) {
                        return item;
                    }
                }
            }

            options.push(getArrayElementByRowCol(GlobalVar.grayMatrix, 1, 2));
            options.push(getArrayElementByRowCol(GlobalVar.grayMatrix, 2, 3));
            options.push({ color: { gray: 0 } });
            options.push({ color: { gray: 'Kein Sinn' }, answer: true });
            width += 100;
            height += 100;
        }

        let container = new PIXI.Graphics();
        container.beginFill(0x777777, .1)
            .drawRoundedRect(0, 0, width, height, 20)
            .endFill();

        let t_sprite = PIXI.Texture.from('imgs/question.png');
        let sprite = new PIXI.Sprite(t_sprite);
        sprite.width = 60;
        sprite.height = 60;
        sprite.x = 10;
        sprite.y = 10;
        container.addChild(sprite);

        let text_question = new PIXI.Text(question_description, { fill: 0x0, fontSize: 50, fontFamily: "UnitMedium", fontStyle: "italic", padding: 15 });
        text_question.x = 80;
        text_question.y = 10;
        container.addChild(text_question);

        let generateOptions = (tag, options, offsetX, offsetY, extra?) => {
            let extra_width = 0;
            let extra_height = 0
            if (extra) {
                extra_width = 90;
                extra_height = 100;
            }

            let option_index = Math.floor(Math.random() * options.length);

            let counter = 0;
            while (options[option_index].pushed && counter < options.length) {
                option_index = Math.floor(Math.random() * options.length);
                counter++;
                // console.log(counter);
                // console.log(options ,options[option_index]);
            }
            // console.log(tag, options[option_index]);

            options[option_index].pushed = true;
            let option_rect = new PIXI.Graphics();
            option_rect.interactive = true;
            option_rect.buttonMode = true;
            option_rect.x = 50 + offsetX;
            option_rect.y = 80 + offsetY;
            option_rect.clear();
            option_rect.beginFill(0xffffff, 1)
                .drawRoundedRect(0, 0, 120 + extra_width, 55, 15)
                .endFill();


            let tag_text = new PIXI.Text(tag, { fill: 0x0, fontSize: 42, fontFamily: "UnitMedium" });
            tag_text.x = 12;
            tag_text.y = 4;
            let option_text = new PIXI.Text(options[option_index].color.gray, { fill: 0x0, fontSize: 36, fontFamily: "UnitLight" });
            option_text.x = 55;
            option_text.y = 9;
            option_rect.addListener('pointerover', () => {
                if (option_rect.name != "clicked") {
                    option_rect.clear();
                    option_rect
                        .lineStyle(2, 0x888888, 0.7)
                        .beginFill(0x888888, 0.3)
                        .drawRoundedRect(0, 0, 120 + extra_width, 55, 15)
                        .endFill();
                } else {

                }
            });

            option_rect.addListener('pointerout', () => {
                if (option_rect.name != "clicked") {
                    option_rect.clear();
                    option_rect.beginFill(0xffffff, 1)
                        .drawRoundedRect(0, 0, 120 + extra_width, 55, 15)
                        .endFill();
                } else {

                }
            });

            option_rect.addListener('pointerdown', () => {
                option_rect.name = "clicked";
                let t_cross = PIXI.Texture.from('imgs/cross_mark.png');
                let t_check = PIXI.Texture.from('imgs/check_mark.png');
                let symbol = undefined;
                let text = undefined;
                if (options[option_index].answer) {
                    option_rect.clear();
                    option_rect.beginFill(0x228b22, 1)
                        .drawRoundedRect(0, 0, 120 + extra_width, 55, 15)
                        .endFill();
                    symbol = new PIXI.Sprite(t_check);
                    text = new PIXI.Text("Richtig :)", { fill: 0x228b22, fontSize: 40, fontFamily: "UnitMedium" })
                } else {
                    option_rect.clear();
                    option_rect.beginFill(0xb22222, 1)
                        .drawRoundedRect(0, 0, 120 + extra_width, 55, 15)
                        .endFill();
                    symbol = new PIXI.Sprite(t_cross);
                    text = new PIXI.Text("Falsch :(", { fill: 0xb22222, fontSize: 40, fontFamily: "UnitMedium" })
                }
                symbol.width = 50;
                symbol.height = 50;
                symbol.position.set(140, 160 + extra_height);
                symbol.name = "symbol";

                text.position.set(200, 160 + extra_height);
                text.name = "text";

                let t_info = PIXI.Texture.from('imgs/info.png');
                let info = new PIXI.Sprite(t_info);
                info.width = 60;
                info.height = 60;
                info.position.set(10, 220 + extra_height);
                info.name = 'info';

                let tip_text = new PIXI.Text(tip, { fill: 0x0, fontSize: 38, fontFamily: "UnitLight" })
                tip_text.position.set(80, 230 + extra_height);
                tip_text.name = 'tip_text';

                let toBeRemoved = [];
                for (let child of container.children) {
                    if (child.name == "symbol" || child.name == "text") {
                        toBeRemoved.push(child);
                    } else if (child.name == "info" || child.name == "tip_text") {
                        toBeRemoved.push(child);
                    }
                }

                for (let item of toBeRemoved) {
                    container.removeChild(item);
                }

                toBeRemoved = [];

                container.addChild(symbol);
                container.addChild(text);

                container.addChild(info);
                container.addChild(tip_text);

            });

            option_rect.addChild(tag_text);
            option_rect.addChild(option_text);
            return option_rect;
        }

        if (question.includes("f(r,c)=?")) {
            container.addChild(generateOptions('A.', options, 0, 0));
            container.addChild(generateOptions('B.', options, 150, 0));
            container.addChild(generateOptions('C.', options, 300, 0));
        } else if (question.includes("f(1.5,2.5)=sinnvoll?")) {
            container.addChild(generateOptions('A.', options, 0, 0, true));
            container.addChild(generateOptions('B.', options, 250, 0, true));
            container.addChild(generateOptions('C.', options, 0, 90, true));
            container.addChild(generateOptions('D.', options, 250, 90, true));
        }
        return container;
    }
}

export default AnimationFactory;