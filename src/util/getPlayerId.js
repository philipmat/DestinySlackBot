import util from './index';

export default getPlayerId;

function getPlayerId(displayName, membershipType) {
    if (membershipType) {
        return util.searchDestinyPlayer(membershipType, displayName);
    }

    return util.searchDestinyPlayer(-1, displayName).then(results => {
        if (results.length > 1) {
            return Promise.reject(new Error(`Match for ${displayName} found for multiple platforms`));
        } else if(results.length === 0) {
            return Promise.reject(new Error(`Match for ${displayName} not found on either platform`));
        } else {
            return results[0];
        }
    });
}