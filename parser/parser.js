const fs = require("fs");
// const os = require('os');
const path = require("path");
const webvtt = require("node-webvtt");
// const platform = os.platform();
// var divider = '/';
// if (platform === 'win32') {
//     divider = '\\';
// }

const mdRender = require('markdown-it')({ html: true })
    .use(require('markdown-it-link-target'))
    .use(require('markdown-it-highlightjs'), { inline: true })
    // .use(require('markdown-it-prism'))
    .use(require('@traptitech/markdown-it-katex'))
    .use(require('markdown-it-task-lists'))
    .use(require('markdown-it-color').colorPlugin, { inline: true });


const Validator = require("../validator/validator");
const minify = require('html-minifier').minify;

const args = process.argv.slice(2);

// const _dirname = `parser/`;
// const _dirname = `parser/${args[0]}/`;
const _dirname_res = `${args[1]}`;

const validator = new Validator();

const PEG = require("pegjs");
const PEGUtil = require("pegjs-util");
const parser = PEG.generate(fs.readFileSync("parser/parser.pegjs", "utf8"));
// const _dirname_res = `parser/${args[0]}/ilv_resources/`;
console.log("--- START PARSE ILV-DOCUMENT ---");

var result = PEGUtil.parse(parser, fs.readFileSync(path.resolve(_dirname_res, `./${args[0]}.ilv`), "utf8"), {
    startRule: "start"
});

var ilvJSON = {
    fonts: [],
    slides: [],
};

var idArray = [];

const findValueByKey = (key, json) => {
    for (let i = 0; i < json.length; i++) {
        if (key == json[i].key) {
            return json[i].value != null ? json[i].value : "ERROR";
        }
    }
    return undefined;
}

const findTransformationInElement = (type, id, json, parent) => {
    for (let i = 0; i < json.length; i++) {
        let transformation = {};
        if ('transformation' == json[i].key) {
            transformation.elementType = type;
            transformation.startTime = findValueByKey('startTime', json[i].aug);
            transformation.duration = 1;
            // transformation.duration = findValueByKey('duration', json[i].aug) == undefined ? 3 : findValueByKey('duration', json[i].aug);
            transformation.elementId = id;
            transformation.type = findValueByKey('type', json[i].aug);
            if (transformation.type.toLowerCase() == 'move') {
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

const getFileNameFromPath = (path) => {
    let divider = '';
    if (path.includes('/')) {
        divider = '/';
    } else {
        divider = '\\';
    }
    return path.substr(path.lastIndexOf(divider) + 1);
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

const rearrange = (json, slide) => {
    const normalKey = ['comment', 'page', 'name', 'last', "startTime", "duration"];
    let localFontString = "";
    for (let i = 0; i < json.length; i++) {
        let item = json[i];
        if (item.key == 'slide') {
            let _slide = {
                sid: ilvJSON.slides.length + 1,
                startTime: getStartAndDuration(item.aug).startTime,
                duration: getStartAndDuration(item.aug).duration,
                name: findValueByKey('name', item.aug),
                page: findValueByKey('page', item.aug),
                videos: [],
                animations: [],
                images: [],
                quizzes: [],
                customs: [],
                graphics: [],
                texts: []
            };
            rearrange(item.aug, _slide);
            ilvJSON.slides.push(_slide);
        } else if (item.key == 'custom') {
            let custom = {
                transformations: []
            };
            // custom.cid = outputJSON.customs.length + 1;
            custom.path = findValueByKey('path', item.aug);
            custom.cid = findValueByKey('id', item.aug);
            custom.id = custom.cid;
            idArray.push(custom.id);
            // if (custom.path.indexOf('.js') == -1) {
            custom.script = findValueByKey('script', item.aug);
            // console.log(custom.script);
            if (custom.script) {
                if (path.isAbsolute(custom.script)) {
                    custom.scriptContent = fs.readFileSync(custom.script, "utf-8");
                } else {
                    custom.scriptContent = fs.readFileSync(path.resolve(_dirname_res, custom.script), "utf-8");
                }
            }
            // console.log(custom.style);
            custom.style = findValueByKey('style', item.aug);
            if (custom.style) {
                if (path.isAbsolute(custom.style)) {
                    custom.styleContent = fs.readFileSync(custom.style, "utf-8");
                } else {
                    custom.styleContent = fs.readFileSync(path.resolve(_dirname_res, custom.style), "utf-8");
                }
                // custom.styleContent = fs.readFileSync(_dirname_res + custom.style, "utf-8");
            }

            // custom.height = findValueByKey('height', item.aug);
            // custom.width = findValueByKey('width', item.aug);

            // custom.type = "HTML";
            custom.startTime = getStartAndDuration(item.aug, slide).startTime;
            custom.duration = getStartAndDuration(item.aug, slide).duration;
            custom.position = findValueByKey('position', item.aug);
            custom.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            if (path.isAbsolute(custom.path)) {
                custom.htmlContent = "<div class='customComponent'>" + minify(fs.readFileSync(custom.path, "utf-8")) + "</div>";
            } else {
                custom.htmlContent = "<div class='customComponent'>" + minify(fs.readFileSync(path.resolve(_dirname_res, custom.path), "utf-8")) + "</div>";
            }
            findTransformationInElement('custom', custom.cid, item.aug, custom);
            // } else {
            // custom.type = "JS";
            // custom.startTime = getStartAndDuration(item.aug, slide).startTime;
            // custom.duration = getStartAndDuration(item.aug, slide).duration;
            // custom.position = {x: 0, y: 0};
            // custom.htmlContent = "";
            // custom.scriptContent = fs.readFileSync(_dirname_res + custom.path, "utf-8");
            // }
            // console.log(custom.id);
            // custom.name = findValueByKey('name', item.aug);

            // custom.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);

            // console.log(custom.zIndex);
            slide.customs.push(custom);
        } else if (item.key == 'quiz') {
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
            text.content = findValueByKey('content', item.aug).replace(/(\r\n)/gm, '\n').replace(/[^(\S|\n)][^(\S|\n)]{9,15}/gm, '');
            text.content = mdRender.render(text.content);
            // console.log(text.content);
            // /\s\s+/g
            // console.log(text.content.charAt(20));
            text.position = findValueByKey('position', item.aug);
            // text.emphasisTime = findValueByKey('emphasisTime', item.aug) == undefined ? -1 : findValueByKey('emphasisTime', item.aug);
            text.fontSize = findValueByKey('fontSize', item.aug) == undefined ? 32 : findValueByKey('fontSize', item.aug);
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
            video.path = findValueByKey('path', item.aug);
            if (video.path.includes('youtube')) {
                video.isYouTube = true;
                video.isOnline = true;
            } else {
                video.isYouTube = false;
                if (video.path.includes('http')) {
                    video.isOnline = true;
                } else {
                    video.isOnline = false;
                    if (path.isAbsolute(video.path)) {
                        fs.createReadStream(video.path).pipe(fs.createWriteStream(`public/assets/video/${getFileNameFromPath(video.path)}`));
                    } else {
                        fs.createReadStream(path.resolve(_dirname_res, video.path)).pipe(fs.createWriteStream(`public/assets/video/${getFileNameFromPath(video.path)}`));
                    }
                    video.path = getFileNameFromPath(video.path);
                }
            }
            video.position = findValueByKey('position', item.aug);
            video.height = findValueByKey('height', item.aug);
            video.width = findValueByKey('width', item.aug);
            video.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            findTransformationInElement('video', video.vid, item.aug, video);
            slide.videos.push(video);
        } else if (item.key == 'cursor') {
            let cursorAnimation = {};
            cursorAnimation.type = 'cursor';
            cursorAnimation.startTime = findValueByKey('startTime', item.aug);
            // cursorAnimation.startTime = getStartAndDuration(item.aug, slide).startTime;
            // cursorAnimation.duration = getStartAndDuration(item.aug, slide).duration == undefined ? 3 : getStartAndDuration(item.aug, slide).duration;
            cursorAnimation.duration = 1;
            cursorAnimation.moveTo = findValueByKey('moveTo', item.aug);
            slide.animations.push(cursorAnimation);
        } else if (item.key == 'image') {
            let image = {
                transformations: []
            };
            image.iid = findValueByKey('id', item.aug);
            image.id = image.iid;
            idArray.push(image.id);
            image.startTime = getStartAndDuration(item.aug, slide).startTime;
            image.duration = getStartAndDuration(item.aug, slide).duration;
            image.path = findValueByKey('path', item.aug);
            if (image.path.includes('http') || image.path.includes('base64')) {
                image.isOnline = true;
            } else {
                image.isOnline = false;
                if (path.isAbsolute(image.path)) {
                    fs.createReadStream(image.path).pipe(fs.createWriteStream(`public/assets/image/${getFileNameFromPath(image.path)}`));
                } else {
                    fs.createReadStream(path.resolve(_dirname_res, image.path)).pipe(fs.createWriteStream(`public/assets/image/${getFileNameFromPath(image.path)}`));
                }
                image.path = getFileNameFromPath(image.path);
            }
            image.position = findValueByKey('position', item.aug);
            image.height = findValueByKey('height', item.aug) == undefined ? 0 : findValueByKey('height', item.aug);
            image.width = findValueByKey('width', item.aug) == undefined ? 0 : findValueByKey('width', item.aug);
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
            graphics.position = findValueByKey('position', item.aug);
            graphics.height = findValueByKey('height', item.aug);
            graphics.width = findValueByKey('width', item.aug);
            graphics.strokeColor = findValueByKey('strokeColor', item.aug) == undefined ? 'firebrick' : findValueByKey('strokeColor', item.aug);
            graphics.strokeWidth = findValueByKey('strokeWidth', item.aug) == undefined ? 4 : findValueByKey('strokeWidth', item.aug);
            graphics.zIndex = findValueByKey('zIndex', item.aug) == undefined ? 1 : findValueByKey('zIndex', item.aug);
            findTransformationInElement('graphics', graphics.gid, item.aug, graphics);
            slide.graphics.push(graphics);
        } else {
            if (item.key == 'audio') {
                if (item.value) {
                    if (item.value.includes('http')) {
                        ilvJSON[item.key] = item.value;
                    } else {
                        if (path.isAbsolute(item.value)) {
                            fs.createReadStream(item.value).pipe(fs.createWriteStream(`public/assets/${item.key}/${getFileNameFromPath(item.value)}`));
                        } else {
                            fs.createReadStream(path.resolve(_dirname_res, item.value)).pipe(fs.createWriteStream(`public/assets/${item.key}/${getFileNameFromPath(item.value)}`));
                        }
                        ilvJSON[item.key] = getFileNameFromPath(item.value);
                    }
                } else {
                    ilvJSON[item.key] = "ERROR";
                }
            } else if (item.key == 'font') {
                for (let fontItem of item.value) {
                    if (fontItem.includes('fonts.googleapis')) {
                        ilvJSON.fonts.push({
                            fid: ilvJSON.fonts.length + 1,
                            isGoogle: true,
                            isLocal: false,
                            path: fontItem
                        });
                    } else {
                        if (fontItem.includes('http')) {
                            ilvJSON.fonts.push({
                                fid: ilvJSON.fonts.length + 1,
                                isGoogle: false,
                                isLocal: false,
                                path: fontItem
                            });
                        } else {
                            if (path.isAbsolute(fontItem)) {
                                fs.createReadStream(fontItem).pipe(fs.createWriteStream(`./public/assets/${item.key}s/${getFileNameFromPath(fontItem)}`));
                            } else {
                                fs.createReadStream(path.resolve(_dirname_res, fontItem)).pipe(fs.createWriteStream(`./public/assets/${item.key}s/${getFileNameFromPath(fontItem)}`));
                            }
                            ilvJSON.fonts.push({
                                fid: ilvJSON.fonts.length + 1,
                                isGoogle: false,
                                isLocal: true,
                                path: getFileNameFromPath(fontItem)
                            });
                        }
                    }
                }
            } else if (item.key == 'subtitle') {
                if(item.value) {
                    let subtitle = '';
                    if (path.isAbsolute(item.value)) {
                        subtitle = fs.readFileSync(item.value, "utf-8");
                    } else {
                        subtitle = fs.readFileSync(path.resolve(_dirname_res, item.value), "utf-8");
                    }
                    ilvJSON['cues'] = webvtt.parse(subtitle).cues;
                } else {
                    ilvJSON['cues'] = [];
                }
            } else if (normalKey.indexOf(item.key) == -1) {
                ilvJSON[item.key] = item.value != null ? item.value : "ERROR";
            }
        }
    }
}

const isRepeat = (arr) => {
    var hash = {};
    for (var i in arr) {
        if (hash[arr[i]]) {
            throw 'ERROR: ID = ' + arr[i] + ' Collation detected!';
        }
        hash[arr[i]] = true;
    }
}

if (result.error !== null) {
    console.error("ERROR: Parsing Failure:\n" + PEGUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "));
} else {
    console.log("--- PARSE PASS ---");
    rearrange(result.ast);
    console.log("--- ID COLLATION DETECTING ---");
    isRepeat(idArray);
    console.log("--- NO ID COLLATION ---");
    console.log("--- ILV-JSON PREPARED ---");
    console.log("--- ILV-JSON VALIDATING ---");

    if (!validator.validate(ilvJSON)) {
        console.log("--- VALIDATE FAILED ---");
        throw validator.getErrors();
    } else {
        console.log("--- VALIDATE PASS ---");

        fs.writeFile(_dirname_res + `/build_${args[0]}.json`, JSON.stringify(ilvJSON), 'utf8', function (error) {
            if (error) {
                console.log(error);
                return false;
            }
            fs.createReadStream(_dirname_res + `/build_${args[0]}.json`).pipe(fs.createWriteStream(`src/assets/build.json`));
            console.log('--- ILV-JSON EXPORTED ---');
        });
    }
    console.log('--- END PARSE & VALIDATE ILV ---');
}