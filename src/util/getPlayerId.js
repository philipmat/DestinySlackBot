import util from './index';

export default getPlayerId;

function getPlayerId(displayName, membershipType, command) {
    let networkName;

    if (membershipType) {
        networkName = membershipType === 1 ? 'xbox' : 'playstation';
        return util.searchDestinyPlayer(membershipType, displayName);
    }

    return util.searchDestinyPlayer(-1, displayName).then(results => {
        if (results.length > 1) {
            return Promise.reject(
                {
                    attachments:[
                        {
                            title: `Match for ${displayName} found for multiple platforms`,
                            callback_id: command,
                            attachment_type: 'default',
                            actions: [
                                {
                                    "name": displayName,
                                    "text": "Playstation",
                                    "value": `${command} ps ${displayName}`,
                                    "type": "button",
                                },
                                {
                                    "name": displayName,
                                    "text": "Xbox",
                                    "value": `${command} xbox ${displayName}`,
                                    "type": "button",
                                }
                            ]
                        }
                    ]
                })
        } else if(results.length === 0) {
            return Promise.reject(new Error(`Match for ${displayName} not found on either platform`));
        } else {
            return results[0];
        }
    });
}