import BotAction from '../BotAction';
import {COMMAND_GROUPING, REGEX} from '../../constants';


let command = ['help', 'command'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'Provides information on all of the supported command';

function action(bot, message, actions) {
    let response = [];

    actions.forEach(action => {
        let commands = action.getCommand().reduce((output, current) => {
            output.push(`\`${current}${action.requiresGamerTag() ? ' gamertag' : ''}\``);
            return output;
        }, []).join(' | ');
        response.push(`${commands}: ${action.getDescription()}`);
    });
    response.push('_For any questions email destinytrialsreport@gmail.com_');

    bot.reply(message, response.join('\n'));
    return response;
}

export default new BotAction ({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.NONE
})