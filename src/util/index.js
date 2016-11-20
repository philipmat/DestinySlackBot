import {CONFIG} from '../constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

import formatSlackAttachment from'./formatSlackAttachment';
import formatSlackResponse from'./formatSlackResponse';
import getPlayerId from './getPlayerId';
import membershipTypeToPlatform from './membershipTypeToPlatform';
import searchDestinyPlayer from'./searchDestinyPlayer';


export default {
    formatSlackAttachment,
    formatSlackResponse,
    getPlayerId,
    membershipTypeToPlatform,
    searchDestinyPlayer
}