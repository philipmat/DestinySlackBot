import BotAction from '../../bot/BotAction';
import util from '../../util';
import bot_util from '../../bot/util';
import {COMMAND_GROUPING, COLOR, PERSONA} from '../../constants';

let command     = ['streamers', 'tracked'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'Returns a listing of all tracked twitch streams',
    paramRegex  = {};

function action(bot, message, command) {
    let _storage = bot_util.StoragePromise.init(bot.botkit).teams;

    return _storage.get(message.team)
        .then(team_data => {
            return team_data.twitch_streamers || [];
        })
        .then(streamers => {
            return util.slack.personaResponse(
                '*Tracked Twitch Streams*',
                PERSONA.TWITCH,
                util.slack.formatAttachment({
                        text: streamers.sort((a, b) => {
                            let _a = a.name.toLowerCase(),
                                _b = b.name.toLowerCase();
                            if (_a < _b) {
                                return -1;
                            }
                            if (_a > _b) {
                                return 1;
                            }
                            return 0;
                        }).map(
                            streamer => `*Name:* ${streamer.name}\n*Channel:* ${streamer.channel}\n`).join('\n')
                    }
                )
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
    paramRegex
})