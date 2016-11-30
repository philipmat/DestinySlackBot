import {CONFIG} from '../constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

import Convert from './convert';
import getName from'./getName';
import getPlayerId from './getPlayerId';
import searchDestinyPlayer from'./searchDestinyPlayer';
import slack from './slack';

export default {
    Convert,
    getPlayerId,
    searchDestinyPlayer,
    getName,
    slack
}