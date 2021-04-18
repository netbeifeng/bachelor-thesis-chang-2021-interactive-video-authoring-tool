import PowerPointPage from './PowerPointPage';
import powerpoint_map_1 from '../../assets/demo_1/powerpoint_map_1.json';
import powerpoint_map_2 from '../../assets/demo_2/powerpoint_map_2.json';

class PowerPointStory {
    powerpointMap: Array<PowerPointPage> = new Array();
    audio: string = undefined;
    initimate(track: number) {
        // console.log(track);
        
        let playlist = [powerpoint_map_1, powerpoint_map_2];
        let array: Array<any> = Array.from(playlist[track - 1]);
        for (let item of array) {
            this.powerpointMap.push(new PowerPointPage(item.id, item.imgPath, item.description, item.startTime, item.endTime));
        }
        return this;
    }

    getPowerPointMap() {
        return this.powerpointMap;
    }

    getCurrentPowerPointPage(seek: number) {
        for (let page of this.powerpointMap) {
            if (seek >= page.getStartTime() && seek <= page.getEndTime()) {
                return page;
            }
        }
    }
}

export default PowerPointStory;