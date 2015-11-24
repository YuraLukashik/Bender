#!/usr/bin/env node

import "babel-polyfill";
import config from "../app/config_prod.json";
import Bot from "./Bot";
import Slack from "slackbots";
import schedule from "node-schedule";
import UsersService from "./UsersService";
import Commands from "./commands";
import github from "./github_api";

const slack = new Slack({
    token: config.slack.token,
    name: "Bender"
});
const usersService = new UsersService(slack, config);
const commands = new Commands(github);
const bot = new Bot(slack, usersService, config.projects, commands);
bot.wakeUp();

schedule.scheduleJob(config.notifications_time, function() {
    bot.notifyUsersAboutPRs(config.users);
});
