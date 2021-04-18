import axios from 'axios';
import webvtt from 'node-webvtt';
import Caption from './Caption';
import Render from '../../utilities/render/Render';

class CaptionLoader {
    // playlist: Array<String> = ['subtitle_1.vtt', 'subtitle_2.vtt'];
    captions: Array<Caption> = new Array();
    ilvRender: Render = new Render('subtitle');
    constructor() {
        
    }

    initiate() {
        axios.get(`assets/subtitle/${this.ilvRender.getILV().subtitle}`).then(res => {
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