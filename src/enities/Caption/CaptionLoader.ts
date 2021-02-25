import axios from 'axios';
import webvtt from 'node-webvtt';
import Caption from './Caption';

class CaptionLoader {
    playlist: Array<String> = ['subtitle_1.vtt', 'subtitle_2.vtt'];
    captions: Array<Caption> = new Array();
    constructor() {
    }

    initiate(track: number) {
        axios.get(`/subtitles/${this.playlist[track - 1]}`).then(res => {
            for (let item of webvtt.parse(res.data).cues) {
                this.captions.push(new Caption(item.identifier, item.start, item.end, item.text));
            }
        });
    }

    getCaptions() {
        return this.captions;
    }

}

export default CaptionLoader;