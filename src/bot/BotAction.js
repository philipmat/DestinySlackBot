import util from '../util';
import {COMMAND_GROUPING, ERROR_TYPE} from '../constants';
import DestinySlackBotError from './DestinySlackBotError';
import StoragePromise from './util/StoragePromise';

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
        let command = privateProps.get(this).command,
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
        let paramRegex = privateProps.get(this).paramRegex,
            requiresAdmin = privateProps.get(this).requiresAdmin,
            commandParameters = this.getCommandParameters(),
            command = util.parseMessage(message, paramRegex),
            storage = StoragePromise.init(bot.botkit);


        return Promise.resolve()
            .then(() => storage.users.get(message.user))
            .then(user => {
                command.destiny_store = user.destiny_store;
            })
            // Check for missing parameters
            .then(() => {
                let missingParameters;
                missingParameters = commandParameters.filter(param => {
                    return !command[param] && paramRegex[param].required;
                });
                if (paramRegex.gamerTag && !command.gamerTag && !command.destiny_store) {
                    missingParameters.push('gamerTag');
                }

                if (missingParameters.length) {
                    return Promise.reject(
                        new DestinySlackBotError(`Command: \`${this.getCommand()[0]}\` requires a valid \`${missingParameters.join('`,`')}\` be specified`, ERROR_TYPE.MISSING_PARAMETER)
                    )
                }
                return Promise.resolve();
            })
            .then(() => {
                if (!requiresAdmin) {
                    return Promise.resolve();
                }
                return getUser(bot, message)
                    .then(user => {
                        if (!user.is_admin && !user.is_owner) {
                            return Promise.reject(
                                new DestinySlackBotError(`The command ${command.command} can only be invoked by an admin`, ERROR_TYPE.PERMISSION_DENIED)
                            )
                        }
                    })
            })
            .then(() => Promise.resolve(privateProps.get(this).invoke(...arguments, command)))
            .catch(error => BotAction.Error(bot, message, error))
            .catch(error => {
                console.log(`BotAction.Error failed`, error);
            });
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

        switch (error.type) {
            case ERROR_TYPE.ACCOUNT_FOUND_MULTIPLE_PLATFORMS:
                let interactiveResponse = util.slack.interactivePlatformResponse(error.context.parameters.displayName, error.context.parameters.command);

                bot[error.context.parameters.command.replyFunctionName](message, interactiveResponse);
                errorLevel = 'warn';
                break;
            case ERROR_TYPE.ACCESS_DENIED:
                bot.reply(message, error.context);
                errorLevel = 'warn';
                break;
            case ERROR_TYPE.BAD_RESPONSE:
                bot.reply(message, error.context);
                errorLevel = 'error';
                break;
            case ERROR_TYPE.ITEM_EXISTS:
                bot.reply(message, error.context);
                errorLevel = 'warn';
                break;
            case ERROR_TYPE.ITEM_NOT_FOUND:
                bot.reply(message, error.context);
                errorLevel = 'warn';
                break;
            case ERROR_TYPE.MISSING_PARAMETER:
                bot.reply(message, error.context);
                errorLevel = 'error';
                break;
            default:
                errorLevel = 'error';
                break;
        }


        console[errorLevel](error.message ? error.message : error);
        if(errorLevel === 'error' && error.stack) {
            console[errorLevel](error.stack);
        }
    }
}

function getUser(bot, message) {
    return new Promise((resolve, reject) => {
        bot.api.users.info({
            user: message.user
        }, (something, response) => {
            if (response.ok) {
                resolve(response.user);
            } else {
                reject(`Response for users.info not ok`);
            }
        })
    });
}