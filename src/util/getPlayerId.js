import util from './index';
import {ERROR_TYPE} from '../constants';
import DestinySlackBotError from '../bot/DestinySlackBotError';

export default getPlayerId;

function getPlayerId(displayName, membershipType, command) {
    if (membershipType) {
        return util.destiny.searchDestinyPlayer(membershipType, displayName)
            .then(response => {
                if (response instanceof Array && response.length) {
                    return response[0];
                }
                return Promise.reject(new DestinySlackBotError(`searchDestinyPlayer failed for ${displayName} // ${membershipType}`, ERROR_TYPE.BAD_RESPONSE));
            });
    }

    return util.destiny.searchDestinyPlayer(-1, displayName).then(results => {
        if (results.length > 1) {
            return Promise.reject(new DestinySlackBotError(
                `${displayName} found on multiple platforms`,
                ERROR_TYPE.ACCOUNT_FOUND_MULTIPLE_PLATFORMS,
                {
                    parameters: {
                        displayName,
                        command
                    }
                }));
        } else if (results.length === 0) {
            return Promise.reject(new DestinySlackBotError(`Match for ${displayName} not found on either platform`, ERROR_TYPE.ITEM_NOT_FOUND));
        } else {
            return results[0];
        }
    });
}