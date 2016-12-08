import TwitchMonitor from './TwitchMonitor';
import StoragePromise from '../../bot/util/StoragePromise';
import twitchSlackResponse from './helpers/twitchSlackResponse';
import formatAttachment from '../slack/formatAttachment';
import {COLOR} from '../../constants';

let privateProps = new WeakMap();
let runningBots = new WeakMap();
export default class TwitchAnnouncer {
    constructor(refreshInterval = 60000) {
        privateProps.set(this, {
            refreshInterval,
            bots: []
        });
    }

    loadBot(bot) {
        if(privateProps.get(bot)) {
            return;
        }
        let {refreshInterval} = privateProps.get(this);

        privateProps.set(bot, {
            running: false,
            interval: _run(bot, StoragePromise.init(bot.botkit), refreshInterval)
        });
        privateProps.get(this).bots.push(bot);
    }
}

function _run(bot, storage, interval) {
    let onlineStreamers = [],
        team_id         = bot.team_info.id,
        channel_id;

    return setInterval(() => {
        console.info(`Start checking online streams for team: ${team_id}`);
        storage.teams.get(team_id)
            .then(team_data => {
                channel_id = team_data.twitch_announcement_channel;
                return TwitchMonitor.checkOnlineStreamsFor(team_data.streamers || [])
            })
            .then(onlineStreams => _checkNewlyOnlineStreams(onlineStreams, onlineStreamers))
            .then(_processNewlyOnlineStreams)
            .then(response => _sendResponse(bot, response, channel_id))
            .catch(rejection => console.log(rejection));
    }, interval)
}

function _checkNewlyOnlineStreams(onlineStreams, onlineStreamers) {
    let newlyOnline = [],
        allOnline   = [];

    onlineStreams.forEach(stream => {
        allOnline.push(stream.streamer.name);
        if (onlineStreamers.includes(stream.streamer.name)) {
            return;
        }
        newlyOnline.push(stream);
    });
    onlineStreamers.length = 0;
    allOnline.forEach(streamer => onlineStreamers.push(streamer));

    return newlyOnline;
}

function _processNewlyOnlineStreams(streams) {
    console.info(`Processing ${streams.length} online streams`);

    if (!streams.length) {
        return Promise.reject(`There are no newly online streams`);
    }

    let attachments = streams.map(stream => {
        return _formatAttachment(stream.streamer, stream.stream);
    });

    let response = twitchSlackResponse('*Twitch Stream(s) Started*', attachments);

    return response;
}

function _formatAttachment(streamer, stream) {
    return formatAttachment({
        title: `<https://twitch.tv/${streamer.channel}|${streamer.name}> |${stream.channel.status || 'No status'}|`,
        text: `*Game*: ${stream.game} *Viewers*: ${stream.viewers} *Views*: ${stream.channel.views}`,
        thumb_url: stream.preview.medium,
        color: COLOR.TWITCH
    });
}

function _sendResponse(bot, response, channel_id) {
    console.info(`Sending response to channel ${channel_id}`);
    response.channel = channel_id;
    bot.api.chat.postMessage(response);
}