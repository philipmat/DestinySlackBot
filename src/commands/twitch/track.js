import BotAction from '../../bot/BotAction';
import DestinySlackBotError from '../../bot/DestinySlackBotError';
import util from '../../util';
import bot_util from '../../bot/util';
import {COMMAND_GROUPING, PERSONA, REGEX, ERROR_TYPE} from '../../constants';
import CommandParamRegex from '../../bot/CommandParamRegex';
import twitch from 'mrdandandan-twitch-module';

let command       = ['track', 'add'],
    respondsTo    = ['direct_message', 'direct_mention', 'mention'],
    description   = 'Add a new twitch channel to be tracked [ADMIN ONLY]',
    paramRegex    = {
        channel: new CommandParamRegex(REGEX.FIRST_WORD),
        channelName: new CommandParamRegex(REGEX.ANY_TEXT, false)
    },
    requiresAdmin = true;

function action(bot, message, command) {
    let _storage = bot_util.StoragePromise.init(bot.botkit).teams;

    return twitch.channel(command.channel)
        .catch(response => {
            if (response.error) {
                switch (response.error.status) {
                    case 404:
                        return Promise.reject(
                            new DestinySlackBotError(
                                `Twitch invalid channel response`,
                                ERROR_TYPE.BAD_RESPONSE,
                                util.slack.personaResponse(`Specified channel *${command.channel}* is invalid`, PERSONA.TWITCH)
                            )
                        );
                    default:
                        return Promise.reject(
                            new DestinySlackBotError(
                                `Twitch error response`,
                                ERROR_TYPE.BAD_RESPONSE,
                                util.slack.personaResponse(`There was an error looking up *${command.channel}*\n${response.error.message}`, PERSONA.TWITCH)
                            )
                        );
                }
            }
        })
        .then(() => {
            return _storage.get(message.team)
        })
        .then(team_data => {
            let streamers = team_data.twitch_streamers = team_data.twitch_streamers || [];

            let exists = streamers.some(streamer => {
                return streamer.channel.toLowerCase() === command.channel.toLowerCase();
            });
            if (exists) {
                return Promise.reject(
                    new DestinySlackBotError(
                        `Twitch channel already tracked`,
                        ERROR_TYPE.ITEM_EXISTS,
                        util.slack.personaResponse(
                            `Channel *${command.channel}* is already being tracked`,
                            PERSONA.TWITCH
                        )
                    )
                );
            }
            let streamer = {
                channel: command.channel,
                name: command.channelName || command.channel
            };
            streamers.push(streamer);

            return _storage.save(team_data);
        })
        .then(team_data => {
            let streamers = team_data.twitch_streamers = team_data.twitch_streamers || [],
                text = `Twitch channel *${streamers[streamers.length - 1].name}* is now being tracked`;

            return util.slack.personaResponse(text, PERSONA.TWITCH);
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