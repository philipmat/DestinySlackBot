import Bot from './bot/Bot';
import commands from './commands';
import help from './bot/commands/help';

let slackbot = new Bot();
//slackbot.start();

commands.forEach(command => {
    slackbot.registerAction(command.command, command.respondsTo, command.action, command.description, command.args);
});