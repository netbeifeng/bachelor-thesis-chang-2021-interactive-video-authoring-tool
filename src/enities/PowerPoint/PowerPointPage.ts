class PowerPointMap {
    id: number;
    imgPath: string;
    description: string;
    startTime: number;
    endTime: number;

    constructor(id: number, imgPath: string, description: string, startTime: number, endTime: number) {
        this.id = id;
        this.description = description;
        this.imgPath = imgPath;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    getId() {
        return this.id;
    }

    setImgPath(imgPath: string) {
        this.imgPath = imgPath;
    }

    getImgPath() {
        return this.imgPath;
    }

    setDescription(description: string) {
        this.description = description;
    }

    getDescription() {
        return this.description;
    }

    setStartTime(startTime: number) {
        this.startTime = startTime;
    }

    getStartTime() {
        return this.startTime;
    }

    setEndTime(endTime: number) {
        this.endTime = endTime;
    }

    getEndTime() {
        return this.endTime;
    }
}

export default PowerPointMap;