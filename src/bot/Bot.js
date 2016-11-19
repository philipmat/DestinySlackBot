import {slackbot} from 'botkit';
import {CONFIG} from '../constants';
import botCommands from './commands';

import BotAction from './BotAction';

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
            actions: []
        });
    }

    getActions() {
        return privateProps.get(this).actions;
    }

    getController() {
        return privateProps.get(this).controller;
    }

    registerAction(command, respondsTo, action, description, args) {
        let botAction = new BotAction(...arguments);
        let controller = privateProps.get(this).controller,
            actions = privateProps.get(this).actions;

        actions.push(botAction);
        controller.hears(botAction.getCommands(), botAction.respondsTo(), botAction.action());
    }

    start() {
        let controller = privateProps.get(this).controller,
            bots = privateProps.get(this).bots;

        _startWebServer().call(this);
        controller.on('create_bot', (bot, config) => {
            if(bots[bot.config.token]) {
                return;
            }
            bot.startRTM(err => {
                if(!err) {
                    bots[bot.config.token] = bot;
                }

                bot.startPrivateConversation({user: config.createdBy}, (err, convo) => {
                    if(err) {
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
    }
}

function _startWebServer() {
    let controller = privateProps.get(this).controller;

    controller.setupWebserver(CONFIG.PORT, (err, webserver) => {
        controller.createWebhookEndpoints(controller.webserver);

        controller.createOauthEndpoints(controller.webserver, (err, req, res) => {
            if(err) {
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

    controller.hears(botCommands.help.commands, botCommands.help.respondsTo, (bot, message) => {
        botCommands.help.action(bot, message, this.getActions());
    });
}