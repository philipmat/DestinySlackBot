import {CONFIG} from './constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
import Bot from './bot/Bot';
import commands from './commands';

DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

let slackbot = new Bot();
//slackbot.start();

commands.forEach(command => {
    slackbot.registerAction(command.command, command.respondsTo, command.action, command.description);
});