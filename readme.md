# DestinySlackBot

### Installation
DestinySlackBot is built using `botkit` in concert with standard es2015 JavaScript.  
`Babel` is used for transpiling

#### Preparation
* Navigate to [Bungie](https://www.bungie.net/en/Application) and create an application
    * Take note of your application's `Bungie API Key`
* Navigate to [Slack](https://api.slack.com/apps) and create an app
    * After creating your app, take note of `Client ID` and `Client Secret`
    * Navigate to the `Bot Users` tab and name give your bot user a name. 
* Navigate to [Twitch](https://www.twitch.tv/settings/connections) and create an app (bottom of page)
    * Make note of the API key
* Make sure [NodeJS](https://nodejs.org/en/) is installed

#### Process
Run `npm i`

Open `./app.config.js` and update it with the 
`Bungie API Key`,
`Slack Client ID`,
`Slack Client Secret`,
`Twitch API Key`
obtained during preparation.  The port can be modified as well if desired.
```json
{
  "APP": {
    "PORT": 8001,

    "BUNGIE": {
      "API_KEY": "Bungie Api Key"
    },
    "GG" : {
    },
    "SLACK": {
      "CLIENT_ID": "Slack Client Id",
      "CLIENT_SECRET": "Slack Client Secret"
    },
    "TWITCH": {
      "API_KEY": "Twitch Api Key"
    },
    "TRIALS_REPORT": {
      "API_URL": "http://api.destinytrialsreport.com"
    }
  }
}
```

#### Interactive Messages
Slack has introduced the ability to serve interactive messages which users can interact with.  _DestinySlackBot_ leverages this for various features.
To use them locally, there are some additional required steps:

* Install the localtunnel package from npm `npm i -g localtunnel`
* Navigate to the *Interactive Messages* tab on [Your Slack App's Config Page](https://api.slack.com/apps/)
    * Decide on a unique name to use (we will refer to it as `someuniquename`)
    * Set the _Request URL_ to `https://<someuniquename>.localtunnel.me/slack/receive` replacing `<someuniquename>` with your chosen name
    
### Running the bot
Assuming everything above was done properly, we should now be set to run the bot

#### Building
There are some npm scripts defined in `package.json` used for building the bot

Both build commands will create the `./dist` directory and output the built scripts to it.

* `npm run build` will build the bot and include sourcemaps
* `npm run build-deploy` will build the bot without sourcemaps

#### Running
Using node, you can simply run `node dist/app.js` to start the bot

If you are using an IDE that supports debugging, `dist/app.js` is the entry point.

For the _Interactive Messages_ to work, there is one more command that needs to be run when the application is started:

`lt --subdomain <someuniquename> --port <port>` 

where 

* `<someuniquename>` is replaced with the same name as was provided to Slack
* `<port>` is whatever value was decided on in `app.config.json` (default is 8001)

#### Register the bot to your slack team
When the bot starts up, you should see some output in your console similar to the following:
```
...
** Starting webserver on port 8001
info: ** Serving webhook endpoints for Slash commands and outgoing webhooks at: http://127.0.0.1:8001/slack/receive
info: ** Serving login URL: http://127.0.0.1:8001/login
info: ** Serving oauth return endpoint: http://127.0.0.1:8001/oauth
...
```

* Navigate to the `OAuth & Permissions` tab on [Your Slack App's Config Page](https://api.slack.com/apps/)
    * Set the redirect URL(s) to: `http://127.0.0.1:8001/oauth`

* Navigate to `http://127.0.0.1:8001/login` specified in the output and authorize the bot on your team.

*_Congratulations!_* the bot should be set up and good to go!


### Adding a new command
Adding a command is pretty straight forward (hopefully!)

To add a new command to the bot, create a new `.js` file under `./commands`

Boilerplate for a new command:
```javascript
import BotAction from '../../bot/BotAction';
import CommandParamRegex from '../../bot/CommandParamRegex';
import weeklyStats from './weeklyStats';
import {WEEK} from './weeklyStats';
import {COMMAND_GROUPING, REGEX} from '../../constants';

let command = ['<the base command/commands>'],
    respondsTo = ['direct_message', 'direct_mention', 'mention'],
    description = '',
    paramRegex = {
        // Parameters to be parsed out of user input, regex-based
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT)
    };

// Action to be invoked when command is entered
function action(bot, message, command) {
    // Return a promise
    return weeklyStats(WEEK.PREVIOUS, command)
            .then(response => {
                return bot[command.replyFunctionName](message, response)
            });
}

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    // Specify the group this command is a part of
    grouping: COMMAND_GROUPING.ALL,
    paramRegex,
    requiresAdmin // Optional
})
```

*Add the new command to the index file in its directory*


Basic error handling happens at the point where the action is invoked `./Bot/BotAction.js`_.invoke_ which is the reason we want to return a promise from the action itself.

A good example of this is `./util/getPlayerId` which queries Bungie for a `membershipId` based on a provided gamerTag.  If there is a match for this gamertag on multiple platforms, we need to let the user specify the platform.
To do this, we return `Promise.reject()` with an error describing this and the default error handling picks it up and responds with an interactive message to allow the user to select a platform. 
