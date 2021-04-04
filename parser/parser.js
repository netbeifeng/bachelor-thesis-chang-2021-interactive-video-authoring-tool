var fs = require("fs")
var ASTY = require("asty")
var PEG = require("pegjs")
var PEGUtil = require("pegjs-util")

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
    videos: [],
    animations: [],
    images: [],
    slides: [],
    quizzes: [],
    customes: [],
    texts: []
};

const findValueByKey = (key, json) => {
    for (let i = 0; i < json.length; i++) {
        if (key == json[i].key) {
            return json[i].value != null ? json[i].value : json[i].path;
        }
    }
    return undefined;
}

const getLast = (obj) => {
    // console.log(obj);
    if (findValueByKey('startTime', obj) == undefined || findValueByKey('duration', obj) == undefined) {
        // console.log(findValueByKey('last', obj));
        return {
            startTime: findValueByKey('last', obj).startTime,
            duration: findValueByKey('last', obj).endTime - findValueByKey('last', obj).startTime
        }
    } else {
        return {
            startTime: findValueByKey('startTime', obj),
            duration: findValueByKey('duration', obj)
        };
    }
}

const fetchSlides = (json) => {
    for (let i = 0; i < json.length; i++) {
        if (json[i].key == 'slide') {
            parseSlideJSON(json[i].aug);
            let slide = {
                sid: outputJSON.slides.length + 1,
                startTime: getLast(json[i].aug).startTime,
                duration: getLast(json[i].aug).duration,
                name: findValueByKey('name', json[i].aug),
                page: findValueByKey('page', json[i].aug)
            };
            outputJSON.slides.push(slide);
        } else {
            if (json[i].key == 'audio' || json[i].key == 'subtitle') {
                fs.createReadStream(_dirname + json[i].path).pipe(fs.createWriteStream(`public/assests/${json[i].key}/${json[i].path}`));
                outputJSON[json[i].key] = json[i].value != null ? json[i].value : json[i].path;
            } else if (json[i].key != 'comment') {
                outputJSON[json[i].key] = json[i].value != null ? json[i].value : json[i].path;
            }
        }
    }
}

const parseSlideJSON = (json) => {
    for (let i = 0; i < json.length; i++) {
        let item = json[i];
        if (item.key.includes('custom')) {
            let custom = {};
            custom.cid = outputJSON.customes.length + 1;
            custom.name = findValueByKey('name', item.aug);
            custom.startTime = getLast(item.aug).startTime;
            custom.duration = getLast(item.aug).duration;
            custom.path = item.path;
            custom.position = findValueByKey('position', item.aug);
            custom.htmlContent = "<div class='customComponent'>" + fs.readFileSync(_dirname + item.path, "utf-8").replace(/[\r\n]/g, "") + "</div>";
            outputJSON.customes.push(custom);
        } else if (item.key.includes('quiz')) {
            let quiz = {};
            quiz.qid = outputJSON.quizzes.length + 1;
            quiz.name = findValueByKey('name', item.aug);
            quiz.startTime = getLast(item.aug).startTime;
            quiz.duration = getLast(item.aug).duration;
            quiz.position = findValueByKey('position', item.aug);
            quiz.height = findValueByKey('height', item.aug);
            quiz.width = findValueByKey('width', item.aug);
            quiz.questionContent = findValueByKey('questionContent', item.aug);
            quiz.correctAnswer = findValueByKey('correctAnswer', item.aug);
            quiz.wrongAnswers = findValueByKey('wrongAnswers', item.aug);
            quiz.tip = findValueByKey('tip', item.aug);
            outputJSON.quizzes.push(quiz);
        } else if (item.key == 'text') {
            let text = {};
            text.tid = outputJSON.texts.length + 1;
            text.startTime = getLast(item.aug).startTime;
            text.duration = getLast(item.aug).duration;
            text.content = findValueByKey('content', item.aug);
            text.position = findValueByKey('position', item.aug);
            text.fontSize = findValueByKey('fontSize', item.aug) == undefined ? 26 : findValueByKey('fontSize', item.aug);
            text.fontColor = findValueByKey('fontColor', item.aug) == undefined ? '#000000' : findValueByKey('fontColor', item.aug);
            outputJSON.texts.push(text);
        } else if (item.key == 'video') {
            let video = {};
            video.vid = outputJSON.videos.length + 1;
            video.startTime = getLast(item.aug).startTime;
            video.duration = getLast(item.aug).duration;
            if (item.path.includes('http')) {
                video.isOnline = true;
                video.url = item.path;
            } else {
                video.isOnline = false;
                video.path = item.path;
                fs.createReadStream(_dirname + item.path).pipe(fs.createWriteStream(`public/assests/video/${item.path}`));
            }
            video.position = findValueByKey('position', item.aug);
            video.height = findValueByKey('height', item.aug);
            video.width = findValueByKey('width', item.aug);
            outputJSON.videos.push(video);
        } else if (item.key == 'animation') {
            let animation = {};
            animation.aid = outputJSON.animations.length + 1;

        } else if (item.key == 'image') {
            let image = {};
            image.iid = outputJSON.images.length + 1;
            image.startTime = getLast(item.aug).startTime;
            image.duration = getLast(item.aug).duration;
            image.path = item.path;
            if (item.path.includes('http')) {
                image.isOnline = true;
                image.path = item.path;
            } else {
                image.isOnline = false;
                fs.createReadStream(_dirname + item.path).pipe(fs.createWriteStream(`public/assests/image/${item.path}`));
            }
            image.position = findValueByKey('position', item.aug);
            image.height = findValueByKey('height', item.aug);
            image.width = findValueByKey('width', item.aug);
            outputJSON.images.push(image);
        }
    }
}


if (result.error !== null) {
    console.error("ERROR: Parsing Failure:\n" + PEGUtil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "));
} else {
    fetchSlides(result.ast);
    console.log(outputJSON);
    fs.writeFile('./src/assests/build.json', JSON.stringify(outputJSON), 'utf8', function (error) {
        if (error) {
            console.log(error);
            return false;
        }
        console.log('--- Successful parsed! ---');
    })
}



console.log('--- END PARSE ILV ---');