const fs = require("fs");
const ASTY = require("asty");
const PEG = require("pegjs");
const Validator = require("../validator/validator");
const PEGUtil = require("pegjs-util");
const minify = require('html-minifier').minify;


const args = process.argv.slice(2);

const _dirname = `parser/${args[0]}/`;
const _dirname_res = `parser/${args[0]}/ilv_resources/`;
// args[0];
console.log("--- START PARSE ILV-DOCUMENT ---");

const validator = new Validator();

const asty = new ASTY();

const parser = PEG.generate(fs.readFileSync("parser/parser.pegjs", "utf8"));

var result = PEGUtil.parse(parser, fs.readFileSync(_dirname + `${args[0]}.ilv`, "utf8"), {
    startRule: "start",
    makeAST: function (line, column, offset, args) {
        return asty.create.apply(asty, args).pos(line, column, offset)
    }
})

var outputJSON = {
    fonts: [],
    slides: [],
};

var idArray = [];

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
            // console.log(findValueByKey('type', json[i].aug));
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



const getStartAndDuration = (element, slide) => {
    if (findValueByKey('startTime', element) != undefined || findValueByKey('last', element) != undefined) {
        if (findValueByKey('last', element) == undefined) {
            return {
                startTime: findValueByKey('startTime', element),
                duration: findValueByKey('duration', element)
            };
        }

        let startTime = findValueByKey('last', element).startTime;
        let endTime = findValueByKey('last', element).endTime;
        if (endTime < startTime) {
            if (element.page) {
                throw `ERROR: Invalid last parameter in Slide ${element.page} (${element.name}), EndTime ${endTime} less than StartTime ${startTime}.`;
            } else {
                throw `ERROR: Invalid last parameter in Element ${element.id} (${element.name}), EndTime ${endTime} less than StartTime ${startTime}.`;

            }
        }

        return {
            startTime: startTime,
            duration: endTime - startTime
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
                startTime: getStartAndDuration(json[i].aug).startTime,
                duration: getStartAndDuration(json[i].aug).duration,
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
                fs.createReadStream(_dirname_res + json[i].path).pipe(fs.createWriteStream(`public/assets/${json[i].key}/${json[i].path}`));
                outputJSON[json[i].key] = json[i].value != undefined ? json[i].value : json[i].path;
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
                        font-family: 'font${outputJSON.fonts.length + 1}'; 
                        src: url('../fonts/${json[i].path}');
                    }\n`;

                    fs.createReadStream(_dirname_res + json[i].path).pipe(fs.createWriteStream(`./src/assets/${json[i].key}s/${json[i].path}`));

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
            custom.id = custom.cid;
            idArray.push(custom.id);
            // custom.name = findValueByKey('name', item.aug);
            custom.startTime = getStartAndDuration(item.aug, slide).startTime;
            custom.duration = getStartAndDuration(item.aug, slide).duration;
            // custom.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            custom.path = item.path;
            custom.position = findValueByKey('position', item.aug);
            custom.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            custom.htmlContent = "<div class='customComponent'>" + minify(fs.readFileSync(_dirname_res + item.path, "utf-8")) + "</div>";
            findTransformationInElement('custom', custom.cid, item.aug, custom);
            slide.customes.push(custom);
        } else if (item.key.includes('quiz')) {
            let quiz = {
                transformations: []
            };
            // quiz.qid = outputJSON.quizzes.length + 1;
            quiz.qid = findValueByKey('id', item.aug);
            quiz.id = quiz.qid;
            idArray.push(quiz.id);
            // quiz.name = findValueByKey('name', item.aug);
            quiz.type = findValueByKey('type', item.aug);
            quiz.startTime = getStartAndDuration(item.aug, slide).startTime;
            quiz.duration = getStartAndDuration(item.aug, slide).duration;
            quiz.position = findValueByKey('position', item.aug);
            // quiz.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
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
            text.id = text.tid;
            idArray.push(text.id);
            // text.tid = outputJSON.texts.length + 1;
            // console.log(item.aug);
            text.startTime = getStartAndDuration(item.aug, slide).startTime;
            text.duration = getStartAndDuration(item.aug, slide).duration;
            text.content = findValueByKey('content', item.aug).replace(/(\r\n)/gm, '\n').replace(/[^(\S|\n)][^(\S|\n)]{4,11}/gm, '');
            // console.log(text.content);
            // /\s\s+/g
            // console.log(text.content.charAt(20));
            text.position = findValueByKey('position', item.aug);
            // text.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
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
            video.id = video.vid;
            idArray.push(video.id);
            // video.vid = outputJSON.videos.length + 1;
            video.startTime = getStartAndDuration(item.aug, slide).startTime;
            video.duration = getStartAndDuration(item.aug, slide).duration;
            // video.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            video.path = item.path;
            if (item.path.includes('http')) {
                video.isOnline = true;
            } else {
                video.isOnline = false;
                fs.createReadStream(_dirname_res + item.path).pipe(fs.createWriteStream(`public/assets/video/${item.path}`));
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
            cursorAnimation.startTime = getStartAndDuration(item.aug, slide).startTime;
            cursorAnimation.duration = getStartAndDuration(item.aug, slide).duration == undefined ? 3 : getStartAndDuration(item.aug, slide).duration;
            cursorAnimation.moveTo = findValueByKey('moveTo', item.aug);
            slide.animations.push(cursorAnimation);
        } else if (item.key == 'image') {
            let image = {
                transformations: []
            };
            // image.iid = outputJSON.images.length + 1;
            image.iid = findValueByKey('id', item.aug);
            image.id = image.iid;
            idArray.push(image.id);
            image.startTime = getStartAndDuration(item.aug, slide).startTime;
            image.duration = getStartAndDuration(item.aug, slide).duration;
            // image.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            image.path = item.path;
            if (item.path.includes('http')) {
                image.isOnline = true;
                image.path = item.path;
            } else {
                image.isOnline = false;
                fs.createReadStream(_dirname_res + item.path).pipe(fs.createWriteStream(`public/assets/image/${item.path}`));
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
            graphics.id = graphics.gid;
            idArray.push(graphics.id);
            graphics.startTime = getStartAndDuration(item.aug, slide).startTime;
            graphics.duration = getStartAndDuration(item.aug, slide).duration;
            // graphics.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            graphics.position = findValueByKey('position', item.aug);
            // if(graphics.type == 'circle') {
            //     // graphics.radius = findValueByKey('radius', item.aug);
            //     graphics.height = findValueByKey('radius', item.aug) * 2;
            //     graphics.width = findValueByKey('radius', item.aug) * 2;
            // } else {
            graphics.height = findValueByKey('height', item.aug);
            graphics.width = findValueByKey('width', item.aug);
            // }
            graphics.strokeColor = findValueByKey('strokeColor', item.aug) == undefined ? 'firebrick' : findValueByKey('strokeColor', item.aug);
            graphics.strokeWidth = findValueByKey('strokeWidth', item.aug) == undefined ? 4 : findValueByKey('strokeWidth', item.aug);
            graphics.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            findTransformationInElement('graphics', graphics.gid, item.aug, graphics);
            slide.graphics.push(graphics);
        }
    }
}

const isRepeat = (arr) => {
    var hash = {};
    for (var i in arr) {
        if (hash[arr[i]]) {
            throw 'ERROR: ID = ' + arr[i] + ' Collation dected!';
        }
        hash[arr[i]] = true;
    }
}

if (result.error !== null) {
    console.error("ERROR: Parsing Failure:\n" + PEGUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "));
} else {
    console.log("--- PARSE PASS ---");
    fetchSlides(result.ast);
    if (!outputJSON.subtitle) {
        outputJSON.subtitle = "";
    }
    console.log("--- ID COLLATION DETCTING ---");
    isRepeat(idArray);

    console.log("--- NO ID COLLATION ---");
    console.log("--- ILV-JSON PREPARED ---");

    console.log("--- START VALIDATE ILV-JSON ---");
    // console.log(validator.validate(outputJSON));
    if (!validator.validate(outputJSON)) {
        console.log("--- VALIDATE FAILED ---");
        throw validator.getErrors();
    } else {
        console.log("--- VALIDATE PASS ---");
        // console.log(outputJSON);

        fs.writeFile(`./parser/${args[0]}/build.json`, JSON.stringify(outputJSON), 'utf8', function (error) {
            if (error) {
                console.log(error);
                return false;
            }
            fs.createReadStream(`parser/${args[0]}/build.json`).pipe(fs.createWriteStream(`src/assets/build.json`));
            console.log('--- ILV-JSON EXPORTED ---');
        });
    }
    console.log('--- END PARSE & VALIDATE ILV ---');
}
