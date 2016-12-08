import Convert from './convert';
import {REGEX, SLACK_REPLY_FUNCTION_NAME} from '../constants';

export default {
    parse,
    parseAsync
};

function parse(message, paramRegex = {}) {
    // ¿¿
    let command           = message.match ? message.match[0] : message.callback_id,
        replyFunctionName = _getReplyFunctionName(message);

    message = message.text.replace(command, '').trim();

    let platform = message.match(REGEX.PLATFORM),
        values   = {
            command,
            replyFunctionName
        };

    if (platform && platform.length) {
        let _platform = platform[0].trim();
        values.platform = _platform.toLowerCase();
        values.membershipType = Convert.platformToMembershipType(values.platform);
        message = message.replace(_platform, '').trim();
    }

    for (let key in paramRegex) {
        let regex = paramRegex[key].pattern,
            match,
            index;

        // TODO: Kinda rigged, should refactor to something not stupid later
        if (regex.toString().indexOf('(.*?)') !== -1) {
            match = regex.exec(message);
            index = 1;
        } else {
            match = message.match(regex);
            index = 0;
        }

        if (!match || !match.length) {
            values[key] = undefined;
            continue;
        }

        values[key] = match[index].trim();
        message = message.replace(values[key], '');
    }

    return values;
}

function parseAsync(message, paramRegex = {}) {
    return Promise.resolve(parse(message, paramRegex));
}

function _getReplyFunctionName(message) {
    if (message.type === 'interactive_message_callback' ||
        (message.hasOwnProperty('callback_id') && message.channel.startsWith('D'))) {
        return SLACK_REPLY_FUNCTION_NAME.REPLY_INTERACTIVE;
    }
    return SLACK_REPLY_FUNCTION_NAME.REPLY;
}