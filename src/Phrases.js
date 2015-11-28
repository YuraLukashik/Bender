export default class Phrases {
    constructor(phrases) {
        this.phrases = phrases;
        this.prev = [-1, -1];
    }
    phrase() {
        return this.getRandomArrayItem(this.phrases, this.prev);
    }
    getRandomArrayItem() {
        let index;
        while(this.prev.indexOf(index = Math.floor(Math.random() * this.phrases.length)) != -1){}
        this.prev = [index, this.prev[0]];
        return this.phrases[index];
    }
}
