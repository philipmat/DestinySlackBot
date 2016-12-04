import {CONFIG} from '../constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

import Convert from './convert';
import Enumeration from './enumeration';
import getName from'./getName';
import getPlayerId from './getPlayerId';
import parseMessage from './parseMessage';
import destiny from'./destiny';
import slack from './slack';

let exports = {
    Convert,
    destiny,
    Enumeration,
    getName,
    getPlayerId,
    parseMessage: parseMessage.parse,
    parseMessageAsync: parseMessage.parseAsync,
    slack
};

export default exports;