import util from '../../util';
import BotAction from '../../bot/BotAction';
import weeklyStats from './weeklyStats';
import {WEEK} from './weeklyStats';

let command          = ['trials last week', 'trials lastweek'],
    respondsTo       = ['direct_message', 'direct_mention', 'mention'],
    description      = 'returns trials stats for previous week.',
    requiresGamerTag = true;

let regexMap = {
    gamerTag: new RegExp(/.*/g)
};

function action(bot, message) {
    util.parseMessage(message, regexMap)
        .then(command => {
            if(!command.weekNumber && !command.gamerTag) {
                return `Command: \`trials week\` requires a valid \`week number\` and \`gamer tag\` be specified`;
            }

            return weeklyStats(WEEK.PREVIOUS, command)
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