import BotAction from '../../bot/BotAction';
import util from '../../util';
import StoragePromise from '../../bot/util/StoragePromise';
import CommandParamRegex from '../../bot/CommandParamRegex';

import {COMMAND_GROUPING, REGEX} from '../../constants';

let command = ['set', 'register'],
    respondsTo = ['direct_message'],
    description = 'Associate a gamertag/platform with your slack account',
    paramRegex = {
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT)
    };

function action(bot, message, command) {
    let storage = StoragePromise.init(bot.botkit);

    return Promise.all([
        util.getPlayerId(command.gamerTag, command.membershipType, command),
        storage.users.get(message.user)
    ])
        .then(resolved => {
            let [player, user] = resolved;

            user = Object.assign(user || {}, {
                id: message.user,
                destiny_store: {
                    displayName: player.displayName,
                    platform: util.Convert.membershipTypeToPlatform(player.membershipType),
                    membershipId: player.membershipId,
                    membershipType: player.membershipType
                }
            });

            return storage.users.save(user);
        })
        .then(user => bot[command.replyFunctionName](message, `${user.destiny_store.displayName}:${user.id} - ${user.destiny_store.platform}:${user.destiny_store.membershipType} - ${user.destiny_store.membershipId} has been saved`));
}


export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.INFO,
    paramRegex
})