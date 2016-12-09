import Enumeration from './util/enumeration';

const CONFIG = require('./app.config.json').APP;
const METHOD = {
    GET: 'GET',
    POST: 'POST'
};

const COLOR = new Enumeration({
    // Teams
    ALPHA: '#281891',
    BRAVO: '#B8211E',

    // Rarities
    EXOTIC: '#DDCB06',
    LEGENDARY: '#7107B7',
    RARE: '#60ADFF',
    UNCOMMON: '#00AD17',
    COMMON: '#D6D6D6',

    // Damage Types
    ARC: '#85C5EC',
    SOLAR: '#F2721B',
    VOID: '#B184C5',

    // Bot
    BROTHER_VANCE: '#D0D15A',
    BANSHEE_44: '#4A4C47',
    CAYDE_6: '#4A4C47',
    LORD_SHAXX: '#4A4C47',

    // Misc
    ORANGE: '#F35A00',
    NEUTRAL: '#D2D2D2',
    TWITCH: '#9171CA'
});

const ICON = new Enumeration({
    BROTHER_VANCE: 'https://avatars.slack-edge.com/2016-03-04/24531630918_f9aaff1dc98d0c43d827_192.png',
    BANSHEE_44: 'http://bungie.net/img/destiny_content/vendor/ae76ecf23cd84d0eae8ebd87f177324e.png',
    CAYDE_6: 'http://bungie.net/img/destiny_content/vendor/c8db203af7a14f16a9f7f32b8f5817b8.png',
    LORD_SHAXX: 'http://bungie.net/img/destiny_content/vendor/14414f531bc248e69d5c70b7a708ccb2.png',
    TWITCH: 'https://cdn4.iconfinder.com/data/icons/simply-8-bits-12/96/twitch.png',
    FLAWLESS_YEAR_3: 'http://bungie.net/common/destiny_content/icons/1b05977e8d0a56538c8a74ce6335ba28.jpg'
});

const PERSONA = new Enumeration({
    BROTHER_VANCE: 0,
    BANSHEE_44: 1,
    CAYDE_6: 2,
    LORD_SHAXX: 3,
    TWITCH: 4
});

const BOT_NAME = new Enumeration({
    BROTHER_VANCE: 'Brother Vance [Bot]',
    BANSHEE_44: 'Banshee-44 [Bot]',
    CAYDE_6: 'Cayde-6 [Bot]',
    LORD_SHAXX: 'Lord Shaxx [Bot]',
    TWITCH: 'Twitch [Bot]'
});

const COMMAND_GROUPING = new Enumeration({
    ALL: 'all',
    CRUCIBLE: 'crucible',
    DIRECTOR: 'director',
    GUNSMITH: 'gunsmith',
    INFO: 'info',
    NONE: 'none',
    TRIALS: 'trials',
    TWITCH: 'twitch'
});

const REGEX = {
    // Always add ANY_TEXT last to the paramRegex collection as it just grabs whatever is left when parsing
    ANY_TEXT: new RegExp(/.*/g),
    FIRST_WORD: new RegExp(/^[A-Za-z]\w+/g),
    GAMER_TAG: new RegExp(/[A-Za-z].+/g),
    PLATFORM: new RegExp(/(xbox|xb1|xb|playstation|ps4|ps)/ig),
    NUMBER: new RegExp(/(^\d+\s)|(\s\d+\s)|(\s\d+$)|(^\d+$)/g),
    SLACK_CHANNEL_REFERENCE: new RegExp(/<#(.*?)\|\w+>/g),
    SLACK_CHANNEL_NAME: new RegExp(/<#.*\|(.*?)>/g)
};

const ERROR_TYPE = new Enumeration({
    GENERAL: 0,
    MISSING_PARAMETER: 100,
    ACCESS_DENIED: 9999,
    ACCOUNT_FOUND_MULTIPLE_PLATFORMS: 1000,
    BAD_RESPONSE: 2000,
    ITEM_EXISTS: 3000,
    ITEM_NOT_FOUND: 3100
});

const ADVISOR = new Enumeration({
    ARMS_DAY: 'armsDay',
    AVAILABLE_BOUNTIES: 'availableBounties',
    DAILY_CHAPTER: 'dailyChapter',
    DAILY_CRUCIBLE: 'dailyCrucible',
    HEROIC_STRIKE: 'heroicStrike',
    NIGHTFALL: 'nightfall',
    WEEKLY_CRUCIBLE: 'weeklyCrucible'
});

const TRIALS_MAPS = new Enumeration({
    BURNING_SHRINE: '284635225',
    MEMENTO: '469270447',
    DRIFTER: '1851417512',
    ANOMALY: '2082069870',
    WIDOWS_COURT: '2332037858',
    BLIND_WATCH: '2430076725',
    FRONTIER: '2507231345',
    COULDRON: '2680821721',
    FLOATING_GARDENS: '3053288711',
    FIREBASE_DELPHI: '3101475152',
    TIMEKEEPER: '3277621970',
    ASYLUM: '3292667877',
    BANNERFALL: '3602734434',
    TWILIGHT_GAP: '3817155567',
    BLACK_SHIELD: '3848655103',
    FIRST_LIGHT: '3856604751',
    LAST_EXIT: '4105918304',
    RUSTED_LANDS: '4107311671',
    PANTHEON: '4260139097',
    EXODUS_BLUE: '4287936726'
});

const SYSTEM_STRINGS = {
    EMPTY: '',
    INTERACTIVE: 'interactive'
};

const SLACK_REPLY_FUNCTION_NAME = new Enumeration({
    REPLY: 'reply',
    REPLY_INTERACTIVE: 'replyInteractive'
});

export {
    CONFIG,
    ERROR_TYPE,
    METHOD,
    REGEX,
    SLACK_REPLY_FUNCTION_NAME,
    SYSTEM_STRINGS,

    COMMAND_GROUPING,

    BOT_NAME,
    COLOR,
    ICON,
    PERSONA,

    ADVISOR,

    TRIALS_MAPS
}