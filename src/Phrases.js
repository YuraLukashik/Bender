function getRandomArrayItem(arr, prev) {
    let index;
    while(prev.indexOf(index = Math.floor(Math.random() * arr.length)) != -1){}
    prevIndex = [index, prevIndex[0]];
    return arr[index];
}

export default class Phrases {
    constructor(phrases) {
        this.phrases = phrases;
        this.prev = [-1, -1];
    }
    phrase() {
        return getRandomArrayItem(this.phrases, this.prev);
    }
}
