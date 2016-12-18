import {ERROR_TYPE} from '../constants';

export default DestinySlackBotError;

function DestinySlackBotError(message, type, context = {text: message}) {
    this.name = `DestinySlackBotError`;
    this.message = message || `An error occurred with the bot`;
    this.stack = (new Error()).stack;
    this.type = type || ERROR_TYPE.GENERAL;
    this.type_name = ERROR_TYPE.toString(type);
    this.context = context;
}

DestinySlackBotError.prototype = Object.create(Error.prototype);
DestinySlackBotError.prototype.constructor = DestinySlackBotError;