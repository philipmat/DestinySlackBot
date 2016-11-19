import util from './index';

export default getPlayerId;

function getPlayerId(displayName, membershipType) {
    let networkName;

    if (membershipType) {
        networkName = membershipType === 1 ? 'xbox' : 'playstation';
        return util.searchDestinyPlayer(membershipType, displayName);
    }

    return Promise.all([
        util.searchDestinyPlayer(1, displayName),
        util.searchDestinyPlayer(2, displayName)
    ]).then(results => {
        if(results[0] && results[1]) {
            return Promise.reject(new Error(`Match for ${displayName} found for multiple platforms`));
        } else if(results[0]) {
            return results[0];
        } else if (results[1]) {
            return results[1];
        } else {
            return Promise.reject(new Error(`Match for ${displayName} not found on either platform`));
        }
    });
}