import util from '../util';
import {COMMAND_GROUPING, ERROR_TYPE} from '../constants';

let privateProps = new WeakMap();
export default class BotAction {
    constructor({command, respondsTo, action, description, grouping = COMMAND_GROUPING.ALL, paramRegex = {}, requiresAdmin = false}) {
        privateProps.set(this, {
            command: command instanceof Array ? command : command.split(','),
            respondsTo: respondsTo instanceof Array ? respondsTo : respondsTo.split(','),
            invoke: typeof(action) === 'function' ? action : function () {
            },
            description,
            grouping,
            paramRegex,
            requiresAdmin
        });
    }

    getCommand() {
        let command  = privateProps.get(this).command,
            grouping = privateProps.get(this).grouping;
        return command.reduce((output, current) => {
            if ([COMMAND_GROUPING.ALL, COMMAND_GROUPING.NONE].includes(grouping)) {
                output.push(current);
            } else {
                output.push(`${grouping} ${current}`);
            }
            return output;
        }, []);
    }

    getRespondsTo() {
        return privateProps.get(this).respondsTo;
    }

    invoke(bot, message) {
        let paramRegex        = privateProps.get(this).paramRegex,
            requiresAdmin     = privateProps.get(this).requiresAdmin,
            commandParameters = this.getCommandParameters(),
            command           = util.parseMessage(message, paramRegex),
            missingParameters;

        missingParameters = commandParameters.filter(param => {
            return !command[param] && paramRegex[param].required;
        });

        if (!missingParameters.length) {
            let request = requiresAdmin ? getUser(bot, message) : Promise.resolve();
            return request
                .then(user => {
                    if (!requiresAdmin) {
                        return;
                    }
                    if (!user.is_admin && !user.is_owner) {
                        return Promise.reject(`The command ${command.command} can only be invoked by an admin`);
                    }
                })
                .then(() => Promise.resolve(privateProps.get(this).invoke(...arguments, command)))
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
            values     = [];

        for (let key in paramRegex) {
            values.push(key);
        }

        return values;
    }

    static Error(bot, message, error) {
        error = error || {};

        let errorLevel;

        switch (error.type) {
            case ERROR_TYPE.ACCOUNT_FOUND_MULTIPLE_PLATFORMS:
                let interactiveResponse = util.slack.interactivePlatformResponse(error.context.parameters.displayName, error.context.parameters.command);
                bot.reply(message, interactiveResponse);
                errorLevel = 'warn';
                break;
            default:
                errorLevel = 'error';
                break;
        }

        bot.reply(message, error.message ? error.message : error);
        console[errorLevel](error.message ? error.message : error);
    }
}

function getUser(bot, message) {
    return new Promise((resolve, reject) => {
        bot.api.users.info({
            user: message.user
        }, (something, response) => {
            if(response.ok) {
                resolve(response.user);
            } else {
                reject(`Response for users.info not ok`);
            }
        })
    });
}