import BotAction from '../../bot/BotAction';
import DestinySlackBotError from '../../bot/DestinySlackBotError';
import util from '../../util';
import bot_util from '../../bot/util';
import {COMMAND_GROUPING, COLOR, REGEX, ERROR_TYPE} from '../../constants';
import CommandParamRegex from '../../bot/CommandParamRegex';

let command       = ['register announcements'],
    respondsTo    = ['direct_message', 'direct_mention', 'mention'],
    description   = 'Registers a single channel for twitch online notification broadcasts',
    paramRegex    = {
        slackChannelReference: new CommandParamRegex(REGEX.SLACK_CHANNEL_REFERENCE),
        slackChannelName: new CommandParamRegex(REGEX.SLACK_CHANNEL_NAME, false)
    },
    requiresAdmin = true;

function action(bot, message, command) {
    let _storage = bot_util.StoragePromise.init(bot.botkit).teams;

    return _storage.get(message.team)
        .then(team_data => {
            if (team_data.twitch_announcement_channel === command.slackChannelReference) {
                return Promise.reject(
                    new DestinySlackBotError(
                        `Twitch channel already registered`,
                        ERROR_TYPE.ITEM_EXISTS,
                        util.twitch.helpers.twitchSlackResponse(
                            `Channel <#${command.slackChannelReference}|${command.slackChannelName}> is already registered`
                        )
                    )
            )
                ;
            }
            team_data.twitch_announcement_channel = command.slackChannelReference;
            return _storage.save(team_data);
        })
        .then(() => {
            return util.twitch.helpers.twitchSlackResponse(
                '*Tracked Twitch Streams*',
                util.slack.formatAttachment({
                    text: `Channel <#${command.slackChannelReference}|${command.slackChannelName}> registered for twitch announcements!`,
                    color: COLOR.TWITCH
                })
            )
        })
        .then(response => bot[command.replyFunctionName](message, response));
}

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.TWITCH,
    paramRegex,
    requiresAdmin
})