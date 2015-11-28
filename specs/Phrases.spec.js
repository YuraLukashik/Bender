import Phrases from "../src/Phrases";
import {expect} from "chai";

let phrasesList, phrases;

describe("Phrases", function() {
    beforeEach(function(){
        phrasesList = [
            1,2,3,4,5,6,7,8,9,10,11
        ];
        phrases = new Phrases(phrasesList);
    });
    describe(".phrase()", function() {
        it("returns one of passed values", function() {
            expect(phrasesList).to.include(phrases.phrase());
        });
        it("returns two different phrases", function(){
            expect(phrases.phrase()).to.not.eq(phrases.phrase());
        });
    });
});
