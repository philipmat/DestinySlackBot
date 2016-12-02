import util from '../../util';
import BotAction from '../../bot/BotAction';
import weeklyStats from './weeklyStats';
import {WEEK} from './weeklyStats';

let command          = ['trials week', 'trialsweek'],
    respondsTo       = ['direct_message', 'direct_mention', 'mention'],
    description      = 'returns trials stats for specified week.',
    requiresGamerTag = true;

let regexMap = {
    weekNumber: new RegExp(/(^\d+\s)|(\s\d+\s)|(\s\d+$)/g),
    gamerTag: new RegExp(/.*/g)
};

function action(bot, message) {
    util.parseMessage(message, regexMap)
        .then(command => {
            if(!command.weekNumber && !command.gamerTag) {
                return `Command: \`trials week\` requires a valid \`week number\` and \`gamer tag\` be specified`;
            }

            return weeklyStats(command.weekNumber, command.gamerTag)
        })
        .then(response => bot.reply(message, response))
        .catch(error => console.log(error.message));
}

export default new BotAction(
    command,
    respondsTo,
    action,
    description,
    requiresGamerTag
)