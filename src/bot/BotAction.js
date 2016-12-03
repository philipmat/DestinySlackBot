import util from '../util';
import {COMMAND_GROUPING} from '../constants';

let privateProps = new WeakMap();
export default class BotAction {
    constructor({command, respondsTo, action, description, grouping = COMMAND_GROUPING.ALL, paramRegex = {}}) {
        privateProps.set(this, {
            command: command instanceof Array ? command : command.split(','),
            respondsTo: respondsTo instanceof Array ? respondsTo : respondsTo.split(','),
            invoke: typeof(action) === 'function' ? action : function() {},
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

        if(!missingParameters.length) {
            return privateProps.get(this).invoke(...arguments, command);
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

    // requiresGamerTag() {
    //     return !!privateProps.get(this).requiresGamerTag;
    // }

    getCommandParameters() {
        let paramRegex = privateProps.get(this).paramRegex,
            values = [];

        for(let key in paramRegex) {
            values.push(key);
        }

        return values;
    }
}