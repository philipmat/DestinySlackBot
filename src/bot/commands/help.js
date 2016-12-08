import BotAction from '../BotAction';
import CommandParamRegex from '../CommandParamRegex';
import {COMMAND_GROUPING, REGEX, COLOR} from '../../constants';


let command = ['help', 'command'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = 'Provides information on all of the supported command',
    paramRegex = {
        commandGroup: new CommandParamRegex(REGEX.ANY_TEXT, false)
    };

function action(bot, message, actions, command) {
    if (!command.commandGroup) {
        bot.reply(message, _buildGroupingSelectionInteractiveResponse());
        return;
    }

    let groupedActions = actions.filter(action => {
        return [COMMAND_GROUPING.ALL, action.getGrouping()].includes(command.commandGroup)
    });

    let response = _buildHelpMessage(groupedActions, COMMAND_GROUPING.toString(command.commandGroup));
    response.push('\n_For any questions email destinytrialsreport@gmail.com_');

    bot[command.replyFunctionName](message, response.join('\n'));
}

function _buildHelpMessage(actions, commandGroup) {
    let response = [`*Help for command group: ${commandGroup}*\n`];
    if(!actions.length) {
        response.push(`_No commands implemented for this grouping_`)
    } else {
        actions.forEach(action => {
            let commandParameters = action.getCommandParameters(),
                commandParameterString = commandParameters.length ? ` <${commandParameters.join('> <')}>` : '';
            let commands = action.getCommand().reduce((output, current) => {
                output.push(`\`${current}${commandParameterString}\``);
                return output;
            }, []).join(' | ');
            response.push(`${commands}: ${action.getDescription()}`);
        });
    }
    return response;
}
function _buildGroupingSelectionInteractiveResponse() {
    let response = {
            attachments: []
        },
        attachment = {
            title: `Select command grouping for help`,
            callback_id: `help`,
            attachmentType: `default`,
            actions: [],
            color: COLOR.SOLAR
        };

    for(let key in COMMAND_GROUPING) {
        if(!COMMAND_GROUPING.hasOwnProperty(key)) {
            continue;
        }
        let grouping = COMMAND_GROUPING[key];
        if(grouping === COMMAND_GROUPING.NONE) {
            continue;
        }

        attachment.actions.push({
            name: grouping,
            text: grouping,
            value: `help ${grouping}`,
            type: `button`
        });

        if(attachment.actions.length >= 5) {
            response.attachments.push(attachment);
            attachment = {
                fallback: `additional options`,
                callback_id: `help`,
                attachmentType: `default`,
                actions: [],
                color: COLOR.SOLAR,
                mrkdwn_in: ["text", "pretext", "title"]
            }
        }
    }

    response.attachments.push(attachment);
    return response;
}

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.NONE,
    paramRegex
})