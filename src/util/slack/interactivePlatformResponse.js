export default interactivePlatformResponse;

function interactivePlatformResponse(displayName, command) {
    return {
        attachments: [
            {
                title: `Match for ${displayName} found for multiple platforms`,
                callback_id: command.baseCommand,
                attachment_type: 'default',
                actions: [
                    {
                        "name": displayName,
                        "text": "Playstation",
                        "value": `${command.command} ps`,
                        "type": "button",
                    },
                    {
                        "name": displayName,
                        "text": "Xbox",
                        "value": `${command.command} xbox`,
                        "type": "button",
                    }
                ]
            }
        ]
    };
}