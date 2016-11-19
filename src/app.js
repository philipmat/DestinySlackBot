import Bot from './bot/Bot';
import commands from './commands';

let slackbot = new Bot();
//slackbot.start();

commands.forEach(command => {
    slackbot.registerAction(command.command, command.respondsTo, command.action, command.description);
});