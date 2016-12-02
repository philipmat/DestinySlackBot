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
            if (!command.gamerTag) {
                return `Command: \`trials last week\` requires a valid \`gamer tag\` be specified`;
            }

            return weeklyStats(WEEK.PREVIOUS, command)
        })
        .then(response => {
            if(message.type === 'interactive_message_callback') {
                return bot.replyInteractive(message, response);
            }
            return bot.reply(message, response)
        })
        // .then(response => bot.reply(message, response))
        .catch(error => {
            if (error.type === 'interactive') {
                return bot.reply(message, error.payload);
            }
            console.log(error.message)
        });
}

export default new BotAction(
    command,
    respondsTo,
    action,
    description,
    requiresGamerTag
)