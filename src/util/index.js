import {CONFIG} from '../constants';
import {DestinyApiRequest} from 'mrdandandan-destiny-api-module';
DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

import aggregateMatchStatsToSlackFields from './aggregateMatchStatsToSlackFields';
import Convert from './convert';
import formatSlackAttachment from'./formatSlackAttachment';
import formatSlackResponse from'./formatSlackResponse';
import getName from'./getName';
import getPlayerId from './getPlayerId';
import searchDestinyPlayer from'./searchDestinyPlayer';

export default {
    aggregateMatchStatsToSlackFields,
    Convert,
    formatSlackAttachment,
    formatSlackResponse,
    getPlayerId,
    searchDestinyPlayer,
    getName
}