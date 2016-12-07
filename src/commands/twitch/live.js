import BotAction from '../../bot/BotAction';
import util from '../../util';
import bot_util from '../../bot/util';
import {COMMAND_GROUPING, COLOR, REGEX} from '../../constants';
import CommandParamRegex from '../../bot/CommandParamRegex';

let command     = ['live', 'online'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'Returns all online tracked twitch streams',
    paramRegex  = {
        channel: new CommandParamRegex(REGEX.ANY_TEXT, false)
    };

function action(bot, message, command) {
    let _storage = bot_util.StoragePromise.init(bot.botkit).teams;
    let promise = command.channel ?
        Promise.resolve([{name: command.channel, channel: command.channel}]) :
        _storage.get(message.team)
            .then(team_data => {
                return team_data.streamers || [];
            });


    return promise
        .then(streamers => util.twitch.TwitchMonitor.checkOnlineStreamsFor(streamers))
        .then(_processOnlineStreams)
        .then(response => bot[command.replyFunctionName](message, response));
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
    paramRegex
})