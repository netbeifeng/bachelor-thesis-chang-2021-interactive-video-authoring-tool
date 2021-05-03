import axios from 'axios';
import webvtt from 'node-webvtt';
import Caption from './Caption';
import ILVObject from '../../utilities/ILVObject';

class CaptionLoader {
    captions: Array<Caption> = new Array();
    // objectFactory: ILVGenerator = new ILVObject('subtitle');
    constructor() {
        
    }

    initiate() {
        if(ILVObject.subtitle.length > 0) {
            axios.get(`assets/subtitle/${ILVObject.subtitle}`).then(res => {
                for (let item of webvtt.parse(res.data).cues) {
                    this.captions.push(new Caption(item.identifier, item.start, item.end, item.text));
                }
            });
        }
        console.log('No Subtitle INPUT!');
    }

    getCaptions() {
        return this.captions;
    }

}

export default CaptionLoader;