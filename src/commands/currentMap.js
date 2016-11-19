import api from '../destinytrialsreport-api-module';

let command     = ['currentmap', 'trials map'],
    respondsTo  = ['direct_message', 'direct_mention', 'mention'],
    description = 'returns the most recent trials map';

function action(bot, message) {
    api.general.currentMap()
        .then(result => {
            if(!result) {
                return;
            }

            let mapName = result['activityName'],
                pgcrImage = result['pgcrImage'];

            let response = {
                text: `This week's map is...`,
                attachments: [
                    {
                        fallback: mapName,
                        text: mapName,
                        image_url: `http://www.bungie.net${pgcrImage}`
                    }
                ]
            };

            console.log(response);
            //bot.reply(message, response);
        });
}

export default {
    command,
    respondsTo,
    action,
    description
}