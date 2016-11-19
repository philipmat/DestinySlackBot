import Bot from './bot/Bot';
import commands from './commands';
import help from './commands/help';

let slackbot = new Bot();
//slackbot.start();

commands.forEach(command => {
    slackbot.registerAction(command.command, command.respondsTo, command.action, command.description, command.args);
});
let helpCommand = help(slackbot.getActions());
slackbot.registerAction(helpCommand.command, helpCommand.respondsTo, helpCommand.action, helpCommand.description);