import BotAction from '../../bot/BotAction';
import DestinySlackBotError from '../../bot/DestinySlackBotError';
import util from '../../util';
import bot_util from '../../bot/util';
import {COMMAND_GROUPING, PERSONA, REGEX, ERROR_TYPE} from '../../constants';
import CommandParamRegex from '../../bot/CommandParamRegex';

let command       = ['untrack'],
    respondsTo    = ['direct_message', 'direct_mention', 'mention'],
    description   = 'Removes a Twitch channel from tracking',
    paramRegex    = {
        channel: new CommandParamRegex(REGEX.ANY_TEXT)
    },
    requiresAdmin = true;

function action(bot, message, command) {
    let _storage = bot_util.StoragePromise.init(bot.botkit).teams;
    let promise = command.channel ?
        Promise.resolve([{name: command.channel, channel: command.channel}]) :
        _storage.get(message.team)
            .then(team_data => {
                return team_data.twitch_streamers || [];
            });

    return _storage.get(message.team)
        .then(team_data => {
            let streamers = team_data.twitch_streamers || [],
                index     = streamers.findIndex(streamer => {
                    return streamer.channel.toLowerCase() === command.channel.toLowerCase();
                });

            if (index === -1) {
                return Promise.reject(
                    new DestinySlackBotError(
                        `Twitch channel not found`,
                        ERROR_TYPE.ITEM_NOT_FOUND,
                        util.slack.personaResponse(
                            `Unable to find a match for *${command.channel}* - Try executing \`twitch tracked\` to verify *${command.channel}* exists`,
                            PERSONA.TWITCH
                        )
                    )
                )
            }

            streamers.splice(index, 1);

            return _storage.save(team_data);
        })
        .then(() => {
            return util.slack.personaResponse(
                `Channel *${command.channel}* successfully untracked`,
                PERSONA.TWITCH
            );
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