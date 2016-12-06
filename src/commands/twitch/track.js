import BotAction from '../../bot/BotAction';
import util from '../../util';
import bot_util from '../../bot/util';
import {COMMAND_GROUPING, COLOR, REGEX} from '../../constants';
import CommandParamRegex from '../../bot/CommandParamRegex';

let command     = ['track', 'add'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'Add a new twitch channel to be tracked [ADMIN ONLY]',
    paramRegex  = {
        channel: new CommandParamRegex(REGEX.FIRST_WORD),
        channelName: new CommandParamRegex(REGEX.ANY_TEXT, false)
    },
    requiresAdmin = true;

function action(bot, message, command) {
    return bot_util.storage.get(bot.botkit.storage.teams, message.team)
        .then(team_data => {
            let streamers = team_data.streamers = team_data.streamers || [];

            let exists = streamers.some(streamer => {
                return streamer.channel.toLowerCase() === command.channel.toLowerCase();
            });
            if(exists) {
                return Promise.reject(`Channel: ${command.channel} is already being tracked`);
            }
            let streamer = {
                channel: command.channel,
                name: command.channelName || command.channel
            };
            streamers.push(streamer);

            return bot_util.storage.save(bot.botkit.storage.teams, team_data);
        });
}

function _processOnlineStreams(streams) {
    let attachments = streams.map(s => {
        let {streamer, stream} = s;

        return util.slack.formatAttachment({
            title: `<https://twitch.tv/${streamer.channel}|${streamer.name}> |${stream.channel.status || 'No status'}|`,
            text: `*Game*: ${stream.game} *Viewers*: ${stream.viewers} *Views*: ${stream.channel.views}`,
            thumb_url: stream.preview.medium,
            color: COLOR.TWITCH
        });
    });

    return util.twitch.helpers.twitchSlackResponse('*Twitch Online:*', attachments);
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