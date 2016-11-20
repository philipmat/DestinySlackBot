import {CONFIG} from '../constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

import getPlayerId from './getPlayerId';
import searchDestinyPlayer from'./searchDestinyPlayer';


export default {
    getPlayerId,
    searchDestinyPlayer
}