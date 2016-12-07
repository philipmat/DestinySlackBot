import util from './index';

export default {
    parse,
    parseAsync
};

const PLATFORM_REGEX = new RegExp(/(xbox|xb1|xb|playstation|ps4|ps)/ig);

function parse(message, paramRegex = {}) {
    // ¿¿
    let command = message.match ? message.match[0] : message.callback_id,
        replyFunctionName = _getReplyFunctionName(message.type);

    message = message.text.replace(command, '').trim();

    let platform = message.match(PLATFORM_REGEX),
        values = {
            command,
            replyFunctionName
        };

    if (platform && platform.length) {
        let _platform = platform[0].trim();
        values.platform = _platform.toLowerCase();
        values.membershipType = util.Convert.platformToMembershipType(values.platform);
        message = message.replace(_platform, '');
    }

    for (let key in paramRegex) {
        let regex = paramRegex[key].pattern,
            match = message.match(regex);

        if (!match || !match.length) {
            values[key] = undefined;
            continue;
        }

        values[key] = match[0].trim();
        message = message.replace(values[key], '');
    }

    return values;
}

function parseAsync(message, paramRegex = {}) {
    return Promise.resolve(parse(message, paramRegex));
}

function _getReplyFunctionName(messageType) {
    switch (messageType) {
        case 'interactive_message_callback':
            return 'replyInteractive';
        default:
            return 'reply';
    }
}