import util from './index';

export default parseMessage;

const PLATFORM_REGEX = new RegExp(/(xbox|xb1|xb|playstation|ps4|ps)/g);

function parseMessage(message, regexMap = {}) {
    // ¿¿
    let command = message.match ? message.match[0] : message.callback_id;
    message = message.text.replace(command, '').trim().toLowerCase();

    let platform = message.match(PLATFORM_REGEX),
        values   = {command: command};

    if (platform && platform.length) {
        values.platform = platform[0].trim();
        values.membershipType = util.Convert.platformToMembershipType(values.platform);
        message = message.replace(values.platform, '');
    }

    for (let key in regexMap) {
        let regex = regexMap[key],
            match = message.match(regex);

        if (!match && !match.length) {
            values[key] = undefined;
            continue;
        }

        values[key] = match[0].trim();
        message = message.replace(values[key], '');
    }

    return Promise.resolve(values);
}