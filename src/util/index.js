import {CONFIG} from '../constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
import {twitchRequest} from 'mrdandandan-twitch-module';
DestinyApiRequest.setApiKey(process.env.BUNGIE_API_KEY || CONFIG.BUNGIE.API_KEY);
twitchRequest.setApiKey(CONFIG.TWITCH.API_KEY);

import Convert from './convert';
import Enumeration from './enumeration';
import getName from'./getName';
import getPlayerId from './getPlayerId';
import parseMessage from './parseMessage';
import destiny from'./destiny';
import slack from './slack';
import twitch from './twitch';

let exports = {
    Convert,
    destiny,
    Enumeration,
    getName,
    getPlayerId,
    parseMessage: parseMessage.parse,
    parseMessageAsync: parseMessage.parseAsync,
    slack,
    twitch
};

export default exports;