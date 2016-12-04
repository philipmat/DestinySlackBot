export default interactivePlatformResponse;

function interactivePlatformResponse(displayName, command) {
    return {
        attachments: [
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
    };
}