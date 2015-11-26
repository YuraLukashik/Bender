import Bot from "../src/Bot";
import chai, {expect} from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";
import {Promise} from "q";
chai.use(sinonChai);

const slackStub = {
    onMessage: function(callback) {
        this.callback = callback;
    },
    postMessageToUser: sinon.spy(),
    name: "Bender"
};
const usersServiceStub = {
    findBySlack: function(){
        return Promise.resolve({});
    }
};
let commandsStub;
describe("Bot", function() {
    let bot;
    beforeEach(function(){
        commandsStub  = sinon.stub({
            run: function(){}
        });
        bot = new Bot(slackStub, usersServiceStub, {}, commandsStub);
    });
    describe("onSlackMessage", function() {
        it("handles data with type message", function() {
            bot.wakeUp();
            slackStub.callback({type: "message"});
            setTimeout(function(){
                expect(bot.commands.run).to.be.called;
            }, 0);
        });
    });
    describe(".answer(message)", function() {
        it("runs commands", function() {
            bot.wakeUp();
            bot.answer({type: "message", user: "Test"})
            setTimeout(function(){
                expect(bot.commands.run).to.be.called;
            }, 0);
        });
    });
});
