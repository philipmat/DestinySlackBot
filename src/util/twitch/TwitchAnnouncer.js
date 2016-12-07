import TwitchMonitor from './TwitchMonitor';
import StoragePromise from '../../bot/util/StoragePromise';
import twitchSlackResponse from './helpers/twitchSlackResponse';
import formatAttachment from '../slack/formatAttachment';
import {COLOR} from '../../constants';

let privateProps = new WeakMap();
let runningBots = new WeakMap();
export default class TwitchAnnouncer {
    constructor(refreshInterval) {
        privateProps.set(this, {
            refreshInterval,
            bots: [],
            running: false
        });
    }

    addBot(bot) {
        privateProps.get(this).bots.push(bot);
    }

    start() {
        let {bots, refreshInterval} = privateProps.get(this);
        privateProps.get(this).running = true;

        bots.forEach(bot => {
            if(runningBots.get(bot)) {
                return;
            }
            _run(bot, StoragePromise.init(bot.botkit.storage), refreshInterval);
            runningBots.set(bot, true);
        })
    }
}

function _run(bot, storage, interval) {
    let onlineStreamers = [],
        team_id         = bot.team_info.id,
        channel_id;

    setInterval(() => {
        console.info(`Start checking online streams for team: ${team_id}`);
        storage.teams.get(team_id)
            .then(team_data => {
                channel_id = team_data.twitch_announcement_channel;
                return TwitchMonitor.checkOnlineStreamsFor(team_data.streamers || [])
            })
            .then(onlineStreams => _checkNewlyOnlineStreams(onlineStreams, onlineStreamers))
            .then(_processNewlyOnlineStreams)
            .then(response => _sendResponse(bot, response, channel_id));
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
    console.info(`Processing ${streams} online streams`);

    if (!streams.length) {
        return Promise.reject();
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