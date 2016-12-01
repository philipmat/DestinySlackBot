import util from '../../util';
import BotAction from '../../bot/BotAction';
import weeklyStats from './weeklyStats';
import {WEEK} from './weeklyStats';

let command          = ['trials last week', 'trials lastweek'],
    respondsTo       = ['direct_message', 'direct_mention', 'mention'],
    description      = 'returns trials stats for previous week.',
    requiresGamerTag = true;

function action(bot, message) {
    util.getName(message)
        .then(gamerTag => weeklyStats(WEEK.PREVIOUS, gamerTag))
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