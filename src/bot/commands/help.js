let command = ['help', 'commands'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'Provides information on all of the supported commands';

function action(bot, message, actions) {
    let response = [];

    actions.forEach(action => {
        let commands = action.command.reduce((output, current) => {
            output.push(`\`${current}${action.requiresGamerTag() ? ' gamertag' : ''}\``);
            return output;
        }, []).join(' | ');
        response.push(`${commands}: ${action.description}`);
    });
    response.push('_For any questions email destinytrialsreport@gmail.com_');

    bot.reply(response.join('\n'));
}

export default {
    command,
    respondsTo,
    action,
    description
}