let CONFIG = require('../dist/constants').CONFIG;
let DestinyApiRequest = require('mrdandandan-destiny-api-module').DestinyApiRequest;
DestinyApiRequest.setApiKey(CONFIG.BUNGIE.API_KEY);

let commands = require('../dist/commands').trials;

let bot = {
    reply: function(message, response) {
        console.log(`Message: ${message ? message.text: '<none>'} \nResponse: ${JSON.stringify(response)}\n\n`);
        return Promise.resolve({message, response});
    }
};

// Random invocation for testing things
let basicGamertagMessage = {
    text: 'ceratedstew',
    match: ['']
};
let numberAndGamertagMessage = {
    text: 'xbox 20 xxl jigsaw',
    match: ['']
};


function currentMapTest() {
    commands.currentMap.invoke(bot);
}

function archnemesisTest() {
    commands.archnemesis.invoke(bot, basicGamertagMessage);
}

function lastWeekStatsTest() {
    commands.lastWeek.invoke(bot, basicGamertagMessage);
}

function thisWeekStatsTest() {
    commands.thisWeek.invoke(bot, basicGamertagMessage);
}

function weekStatsTest() {
    commands.trialsWeek.invoke(bot, numberAndGamertagMessage);
}

// currentMapTest();
// archnemesisTest();
// lastWeekStatsTest();
// thisWeekStatsTest();
weekStatsTest();