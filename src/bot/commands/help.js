import BotAction from '../BotAction';

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

    return response;
    //bot.reply(response.join('\n'));
}

export default new BotAction (
    command,
    respondsTo,
    action,
    description
)