var fs = require("fs")
var ASTY = require("asty")
var PEG = require("pegjs")
var PEGUtil = require("pegjs-util");
var minify = require('html-minifier').minify;

var _dirname = 'parser/';

console.log("--- START PARSE ILV ---");

var asty = new ASTY()
var parser = PEG.generate(fs.readFileSync(_dirname + "parser.pegjs", "utf8"))
var result = PEGUtil.parse(parser, fs.readFileSync(_dirname + "example.ilv", "utf8"), {
    startRule: "start",
    makeAST: function (line, column, offset, args) {
        return asty.create.apply(asty, args).pos(line, column, offset)
    }
})

var outputJSON = {
    fonts: [],
    slides: [],
};

const findValueByKey = (key, json) => {
    for (let i = 0; i < json.length; i++) {
        if (key == json[i].key) {
            return json[i].value != null ? json[i].value : json[i].path;
        }
    }
    return undefined;
}

const findTransformationInElement = (type, id, json, parent) => {
    for (let i = 0; i < json.length; i++) {
        let transformation = {};
        if ('transformation' == json[i].key) {
            // animation.elementType = findValueByKey('elementType', json[i]);
            transformation.elementType = type;
            transformation.startTime = findValueByKey('startTime', json[i].aug);
            transformation.duration = findValueByKey('duration', json[i].aug) == undefined ? 3 : findValueByKey('duration', json[i].aug);
            transformation.elementId = id;
            // animation.elementId = findValueByKey('elementId', json[i]);
            transformation.type = findValueByKey('type', json[i].aug);
            console.log(findValueByKey('type', json[i].aug));
            if (transformation.type.toLowerCase() == 'slide') {
                transformation.toPosition = findValueByKey('toPosition', json[i].aug);
                transformation.toScale = null;
            } else {
                transformation.toPosition = null;
                transformation.toScale = findValueByKey('toScale', json[i].aug);
            }
            parent.transformations.push(transformation);
        }
    }
}

const getLast = (obj, slide) => {
    if (findValueByKey('startTime', obj) != undefined || findValueByKey('last', obj) != undefined) {
        if (findValueByKey('last', obj) == undefined) {
            return {
                startTime: findValueByKey('startTime', obj),
                duration: findValueByKey('duration', obj)
            };
        }
        return {
            startTime: findValueByKey('last', obj).startTime,
            duration: findValueByKey('last', obj).endTime - findValueByKey('last', obj).startTime
        };
    } else {
        // console.log(slide);
        return {
            startTime: slide.startTime,
            duration: slide.duration
        };
    }
}

const fetchSlides = (json) => {
    let localFontString = "";
    for (let i = 0; i < json.length; i++) {
        if (json[i].key == 'slide') {
            let slide = {
                sid: outputJSON.slides.length + 1,
                startTime: getLast(json[i].aug).startTime,
                duration: getLast(json[i].aug).duration,
                name: findValueByKey('name', json[i].aug),
                page: findValueByKey('page', json[i].aug),
                videos: [],
                animations: [],
                images: [],
                quizzes: [],
                customes: [],
                graphics: [],
                texts: []
            };
            // console.log(slide);
            parseSlideJSON(json[i].aug, slide);
            outputJSON.slides.push(slide);
        } else {
            if (json[i].key == 'audio' || json[i].key == 'subtitle') {
                fs.createReadStream(_dirname + json[i].path).pipe(fs.createWriteStream(`public/assets/${json[i].key}/${json[i].path}`));
                outputJSON[json[i].key] = json[i].value != null ? json[i].value : json[i].path;
            } else if (json[i].key == 'font') {
                if (json[i].path.includes('http')) {
                    outputJSON.fonts.push({
                        fid: outputJSON.fonts.length + 1,
                        type: "WebFont",
                        isOnline: true,
                        path: json[i].path
                    });
                } else {
                    localFontString += `@font-face{
                        font-family: 'CustomFont${outputJSON.fonts.length + 1}'; 
                        src: url('../fonts/${json[i].path}');
                    }\n`;

                    fs.createReadStream(_dirname + json[i].path).pipe(fs.createWriteStream(`./src/assets/${json[i].key}s/${json[i].path}`));

                    outputJSON.fonts.push({
                        fid: outputJSON.fonts.length + 1,
                        type: "LocalFont",
                        isOnline: false,
                        path: json[i].path
                    });

                }
            } else if (json[i].key != 'comment') {
                outputJSON[json[i].key] = json[i].value != null ? json[i].value : json[i].path;
            }
        }
    }

    // if(localFontString.length > 0) {
    fs.writeFile('./src/assets/fontCSS/font.scss', localFontString, 'utf8', function (error) {
        if (error) {
            console.log(error);
            return false;
        }
    });
    // }
}

const parseSlideJSON = (json, slide) => {
    for (let i = 0; i < json.length; i++) {
        let item = json[i];
        if (item.key.includes('custom')) {
            let custom = {
                transformations: []
            };
            // custom.cid = outputJSON.customes.length + 1;
            custom.cid = findValueByKey('id', item.aug);
            // custom.name = findValueByKey('name', item.aug);
            custom.startTime = getLast(item.aug, slide).startTime;
            custom.duration = getLast(item.aug, slide).duration;
            custom.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            custom.path = item.path;
            custom.position = findValueByKey('position', item.aug);
            custom.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            custom.htmlContent = "<div class='customComponent'>" + minify(fs.readFileSync(_dirname + item.path, "utf-8")) + "</div>";
            findTransformationInElement('custom', custom.cid, item.aug, custom);
            slide.customes.push(custom);
        } else if (item.key.includes('quiz')) {
            let quiz = {
                transformations: []
            };
            // quiz.qid = outputJSON.quizzes.length + 1;
            quiz.qid = findValueByKey('id', item.aug);
            // quiz.name = findValueByKey('name', item.aug);
            quiz.type = findValueByKey('type', item.aug);
            quiz.startTime = getLast(item.aug, slide).startTime;
            quiz.duration = getLast(item.aug, slide).duration;
            quiz.position = findValueByKey('position', item.aug);
            quiz.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            quiz.height = findValueByKey('height', item.aug);
            quiz.width = findValueByKey('width', item.aug);
            quiz.questionContent = findValueByKey('questionContent', item.aug);
            quiz.correctAnswer = findValueByKey('correctAnswer', item.aug);
            quiz.wrongAnswers = findValueByKey('wrongAnswers', item.aug);
            quiz.tip = findValueByKey('tip', item.aug);
            quiz.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            findTransformationInElement('quiz', quiz.qid, item.aug, quiz);
            slide.quizzes.push(quiz);
        } else if (item.key == 'text') {
            let text = {
                transformations: []
            };
            text.tid = findValueByKey('id', item.aug);
            // text.tid = outputJSON.texts.length + 1;
            // console.log(item.aug);
            text.startTime = getLast(item.aug, slide).startTime;
            text.duration = getLast(item.aug, slide).duration;
            text.content = findValueByKey('content', item.aug).replace(/(\r\n)/gm, '\n').replace(/[^(\S|\n)][^(\S|\n)]{4,11}/gm, '');
            // console.log(text.content);
            // /\s\s+/g
            // console.log(text.content.charAt(20));
            text.position = findValueByKey('position', item.aug);
            text.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            text.fontSize = findValueByKey('fontSize', item.aug) == undefined ? 26 : findValueByKey('fontSize', item.aug);
            text.fontColor = findValueByKey('fontColor', item.aug) == undefined ? '#000000' : findValueByKey('fontColor', item.aug);
            text.fontFamily = findValueByKey('fontFamily', item.aug) == undefined ? 'Arial, Helvetica, sans-serif' : findValueByKey('fontFamily', item.aug);
            text.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            findTransformationInElement('text', text.tid, item.aug, text);
            slide.texts.push(text);
        } else if (item.key == 'video') {
            let video = {
                transformations: []
            };
            video.vid = findValueByKey('id', item.aug);
            // video.vid = outputJSON.videos.length + 1;
            video.startTime = getLast(item.aug, slide).startTime;
            video.duration = getLast(item.aug, slide).duration;
            video.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            video.path = item.path;
            if (item.path.includes('http')) {
                video.isOnline = true;
            } else {
                video.isOnline = false;
                fs.createReadStream(_dirname + item.path).pipe(fs.createWriteStream(`public/assets/video/${item.path}`));
            }
            video.position = findValueByKey('position', item.aug);
            video.height = findValueByKey('height', item.aug);
            video.width = findValueByKey('width', item.aug);
            video.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            findTransformationInElement('video', video.vid, item.aug, video);
            slide.videos.push(video);
        } else if (item.key == 'cursor') {
            let cursorAnimation = {};
            // cursorAnimation.aid = findValueByKey('id', item.aug);
            cursorAnimation.type = 'cursor';
            cursorAnimation.startTime = findValueByKey('startTime', item.aug);
            cursorAnimation.duration = findValueByKey('duration', item.aug) == undefined ? 3 : findValueByKey('duration', item.aug);
            cursorAnimation.moveTo = findValueByKey('moveTo', item.aug);
            slide.animations.push(cursorAnimation);
        } else if (item.key == 'image') {
            let image = {
                transformations: []
            };
            // image.iid = outputJSON.images.length + 1;
            image.iid = findValueByKey('id', item.aug);
            image.startTime = getLast(item.aug, slide).startTime;
            image.duration = getLast(item.aug, slide).duration;
            image.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            image.path = item.path;
            if (item.path.includes('http')) {
                image.isOnline = true;
                image.path = item.path;
            } else {
                image.isOnline = false;
                fs.createReadStream(_dirname + item.path).pipe(fs.createWriteStream(`public/assets/image/${item.path}`));
            }
            image.position = findValueByKey('position', item.aug);
            image.height = findValueByKey('height', item.aug);
            image.width = findValueByKey('width', item.aug);
            image.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            findTransformationInElement('image', image.iid, item.aug, image);
            slide.images.push(image);
        } else if (item.key == "graphics") {
            let graphics = {
                transformations: []
            }
            graphics.type = findValueByKey('type', item.aug);
            graphics.gid = findValueByKey('id', item.aug);
            graphics.startTime = getLast(item.aug, slide).startTime;
            graphics.duration = getLast(item.aug, slide).duration;
            graphics.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            graphics.position = findValueByKey('position', item.aug);
            if(graphics.type == 'circle') {
                // graphics.radius = findValueByKey('radius', item.aug);
                graphics.height = findValueByKey('radius', item.aug) * 2;
                graphics.width = findValueByKey('radius', item.aug) * 2;
            } else {
                graphics.height = findValueByKey('height', item.aug);
                graphics.width = findValueByKey('width', item.aug);
            }
            graphics.strokeColor = findValueByKey('strokeColor', item.aug) == undefined ? 'firebrick' : findValueByKey('strokeColor', item.aug);
            graphics.strokeWidth = findValueByKey('strokeWidth', item.aug) == undefined ? 4 : findValueByKey('strokeWidth', item.aug);
            graphics.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            findTransformationInElement('graphics', graphics.gid, item.aug, graphics);
            slide.graphics.push(graphics);
        }
    }
}


if (result.error !== null) {
    console.error("ERROR: Parsing Failure:\n" + PEGUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "));
} else {
    fetchSlides(result.ast);
    console.log(outputJSON);
    fs.writeFile('./src/assets/build.json', JSON.stringify(outputJSON), 'utf8', function (error) {
        if (error) {
            console.log(error);
            return false;
        }
        console.log('--- Successful parsed! ---');
    })
}

console.log('--- END PARSE ILV ---');