import {CONFIG} from './constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
import Bot from './bot/Bot';
import actions from './commands';

DestinyApiRequest.setApiKey(process.env.BUNGIE_API_KEY || CONFIG.BUNGIE.API_KEY);

let slackbot = new Bot();
console.log('Bot Instantiated');

// TODO: When we actually want to start the bot
slackbot.start();
console.log('Bot Started');

actions.forEach(action => {
    slackbot.registerAction(action);
});
console.log('Commands Loaded');

console.log('Done');
//
// slackbot.helpAction({}, {});
// console.log('Help Action Invoked');