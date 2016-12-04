import util from '../util';
import {COMMAND_GROUPING, ERROR_TYPE} from '../constants';

let privateProps = new WeakMap();
export default class BotAction {
    constructor({command, respondsTo, action, description, grouping = COMMAND_GROUPING.ALL, paramRegex = {}}) {
        privateProps.set(this, {
            command: command instanceof Array ? command : command.split(','),
            respondsTo: respondsTo instanceof Array ? respondsTo : respondsTo.split(','),
            invoke: typeof(action) === 'function' ? action : function () {},
            description,
            grouping,
            paramRegex
        });
    }

    getCommand() {
        return privateProps.get(this).command;
    }

    getRespondsTo() {
        return privateProps.get(this).respondsTo;
    }

    invoke(bot, message) {
        let paramRegex = privateProps.get(this).paramRegex,
            commandParameters = this.getCommandParameters(),
            command = util.parseMessage(message, paramRegex),
            missingParameters;

        missingParameters = commandParameters.filter(param => {
            return !command[param] && paramRegex[param].required;
        });

        if (!missingParameters.length) {
            return Promise.resolve(privateProps.get(this).invoke(...arguments, command))
                .catch(error => BotAction.Error(bot, message, error))
                .catch(error => {
                    console.log(`BotAction.Error failed`, error);
                });
        }

        let errorMessage = `Command: \`${this.getCommand()[0]}\` requires a valid \`${missingParameters.join('`,`')}\` be specified`;
        return bot[command.replyFunctionName](message, errorMessage);
    }

    getDescription() {
        return privateProps.get(this).description;
    }

    getGrouping() {
        return privateProps.get(this).grouping;
    }

    getCommandParameters() {
        let paramRegex = privateProps.get(this).paramRegex,
            values = [];

        for (let key in paramRegex) {
            values.push(key);
        }

        return values;
    }

    static Error(bot, message, error) {
        error = error || {};

        let errorLevel;

        switch(error.type) {
            case ERROR_TYPE.ACCOUNT_FOUND_MULTIPLE_PLATFORMS:
                let interactiveResponse = util.slack.interactivePlatformResponse(error.context.parameters.displayName, error.context.parameters.command);
                bot.reply(message, interactiveResponse);
                errorLevel = 'warn';
                break;
            default:
                errorLevel = 'error';
                break;
        }

        console[errorLevel](error.message ? error.message : error);
    }
}