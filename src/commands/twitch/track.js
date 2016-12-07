import BotAction from '../../bot/BotAction';
import util from '../../util';
import bot_util from '../../bot/util';
import {COMMAND_GROUPING, COLOR, REGEX} from '../../constants';
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
                            util.twitch.helpers.twitchSlackResponse(`Specified channel *${command.channel}* is invalid`
                            )
                        );
                    default:
                        return Promise.reject(
                            util.twitch.helpers.twitchSlackResponse(`There was an error looking up *${command.channel}*\n${response.error.message}`
                            )
                        );
                }
            }
        })
        .then(() => {
            return _storage.get(message.team)
        })
        .then(team_data => {
            let streamers = team_data.streamers = team_data.streamers || [];

            let exists = streamers.some(streamer => {
                return streamer.channel.toLowerCase() === command.channel.toLowerCase();
            });
            if (exists) {
                return Promise.reject(
                    util.twitch.helpers.twitchSlackResponse(
                        `Channel *${command.channel}* is already being tracked`
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
            let streamers = team_data.streamers = team_data.streamers || [],
                text = `Twitch channel *${streamers[streamers.length - 1].name}* is now being tracked`;

            return util.twitch.helpers.twitchSlackResponse(text);
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