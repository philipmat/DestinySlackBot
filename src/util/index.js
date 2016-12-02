import {CONFIG} from '../constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

import Convert from './convert';
import Enumeration from './enumeration';
import getName from'./getName';
import getPlayerId from './getPlayerId';
import parseMessage from './parseMessage';
import searchDestinyPlayer from'./searchDestinyPlayer';
import slack from './slack';

let exports = {
    Convert,
    Enumeration,
    getName,
    getPlayerId,
    parseMessage: parseMessage.parse,
    parseMessageAsync: parseMessage.parseAsync,
    searchDestinyPlayer,
    slack
};

export default exports;