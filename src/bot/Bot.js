import {slackbot} from 'botkit';
import {CONFIG} from '../constants';
import botCommands from './commands';
import TwitchAnnouncer from '../util/twitch/TwitchAnnouncer';

let privateProps = new WeakMap();

export default class Bot {
    constructor() {
        let controller = slackbot({
            json_file_store: './db_slackbutton_bot/',
            interactive_replies: true
        });

        controller.configureSlackApp({
            clientId: CONFIG.SLACK.CLIENT_ID,
            clientSecret: CONFIG.SLACK.CLIENT_SECRET,
            scopes: ['bot']
        });

        privateProps.set(this, {
            controller,
            bots: {},
            actions: [],
            twitchAnnouncer: new TwitchAnnouncer()
        });
    }

    getActions() {
        return privateProps.get(this).actions;
    }

    getController() {
        return privateProps.get(this).controller;
    }

    registerAction(action) {
        let controller = privateProps.get(this).controller,
            actions    = privateProps.get(this).actions;

        actions.push(action);
        controller.hears(action.getCommand(), action.getRespondsTo(), action.invoke.bind(action));
    }

    // TODO: Remove this later.  Used for testing stuff atm
    helpAction(bot, message) {
        botCommands.help.invoke(bot, message, this.getActions());
    }

    start() {
        let controller = privateProps.get(this).controller,
            bots       = privateProps.get(this).bots;

        _startWebServer.call(this);
        controller.on('create_bot', (bot, config) => {
            if (bots[bot.config.token]) {
                return;
            }
            bot.startRTM(err => {
                if (!err) {
                    _trackBot.call(this, bot, bots);
                }

                bot.startPrivateConversation({user: config.createdBy}, (err, convo) => {
                    if (err) {
                        console.log(err);
                    } else {
                        convo.say(`I am a bot that has just joined your team`);
                        convo.say(`You must now /invite me to a channel so that I can be of use!`);
                    }
                });
            });
        });

        controller.on('rtm_open', (bot) => {
            console.log(`** The RTM api just connected!`);
        });

        controller.on('rtm_close', (bot) => {
            console.log(`** The RTM api just closed`);
        });

        _loadBasicInteractions.call(this);
        _connectExistingTeams.call(this);
    }
}

function _trackBot(bot, bots) {
    let twitchAnnouncer = privateProps.get(this).twitchAnnouncer;

    bots[bot.config.token] = bot;
    twitchAnnouncer.loadBot(bot);
}

function _startWebServer() {
    let controller = privateProps.get(this).controller;

    controller.setupWebserver(CONFIG.PORT, (err, webserver) => {
        controller.createWebhookEndpoints(controller.webserver);

        controller.createOauthEndpoints(controller.webserver, (err, req, res) => {
            if (err) {
                res.status(500).send(`Error: ${err}`);
            } else {
                res.send(`Success!`);
            }
        });
    });
}

function _loadBasicInteractions() {
    let controller = privateProps.get(this).controller;

    controller.hears('hello', 'direct_message', (bot, message) => {
        bot.reply(message, 'Hello!');
    });

    controller.hears('^stop', 'direct_message', (bot, message) => {
        bot.reply(message, 'Goodbye');
        bot.rtm.close();
    });

    controller.on('interactive_message_callback', (bot, message) => {
        if(message.callback_id === 'help') {
            botCommands.help.invoke(bot, message, this.getActions());
            return;
        }

        let action = this.getActions().find(a => {
            return a.getCommand().includes(message.callback_id);
        });

        action.invoke(bot, message);

        bot.replyInteractive(message, '_Loading..._');
    });

    controller.hears(botCommands.help.getCommand(), botCommands.help.getRespondsTo(), (bot, message) => {
        botCommands.help.invoke(bot, message, this.getActions());
    });
}

function _connectExistingTeams() {
    let controller = privateProps.get(this).controller,
        bots       = privateProps.get(this).bots;

    controller.storage.teams.all((err, teams) => {

        if (err) {
            throw new Error(err);
        }

        // connect all teams with bots up to slack!
        for (var t  in teams) {
            if (teams[t].bot) {
                controller.spawn(teams[t]).startRTM((err, bot) => {
                    if (err) {
                        console.log('Error connecting bot to Slack:', err);
                    } else {
                        _trackBot.call(this, bot, bots);
                    }
                });
            }
        }
    });
}