import {CONFIG} from '../constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

import Convert from './convert';
import formatSlackAttachment from'./formatSlackAttachment';
import formatSlackResponse from'./formatSlackResponse';
import getPlayerId from './getPlayerId';
import searchDestinyPlayer from'./searchDestinyPlayer';
import getName from'./getName';


export default {
    Convert,
    formatSlackAttachment,
    formatSlackResponse,
    getPlayerId,
    searchDestinyPlayer,
    getName
}