import BotAction from '../../bot/BotAction';
import util from '../../util';
import destinyApi from 'mrdandandan-destiny-api-module';

import CommandParamRegex from '../../bot/CommandParamRegex';

import {COMMAND_GROUPING, REGEX, CLASS_HASH, DAMAGE_TYPE_HASH, RACE_HASH, GENDER_HASH, COLOR} from '../../constants';

let command = ['destiny player'],
    respondsTo = ['direct_mention', 'direct_message'],
    description = 'Get info on a destiny player',
    paramRegex = {
        gamerTag: new CommandParamRegex(REGEX.ANY_TEXT, false)
    };

function action(bot, message, command) {
    let request;
    if (command.gamerTag) {
        request = util.getPlayerId(command.gamerTag, command.membershipType, command);
    } else {
        request = Promise.resolve(command.destiny_store);
    }
    return request
        .then(getSummary)
        .then(buildResponse)
        .then(response => bot[command.replyFunctionName](message, response));
}

function getSummary(player) {
    let {membershipId, membershipType} = player;
    return destinyApi.account.summary({
        membershipId,
        membershipType
    })
        .then(summary => {
            let inventoryRequests = [];

            summary.characters.forEach(character => {
                inventoryRequests.push(
                    destinyApi.account.characterInventory({
                        characterId: character.characterBase.characterId,
                        membershipId,
                        membershipType
                    })
                        .then(inventory => {
                            character.subclass = inventory.buckets.Equippable[0].items[0];
                        })
                )
            });

            return Promise.all(inventoryRequests)
                .then(() => summary);
        });
}

function buildResponse(summary) {
    let {characters} = summary,
        damageTypeColor = {};
    damageTypeColor[DAMAGE_TYPE_HASH.ARC] = COLOR.ARC;
    damageTypeColor[DAMAGE_TYPE_HASH.SOLAR] = COLOR.SOLAR;
    damageTypeColor[DAMAGE_TYPE_HASH.VOID] = COLOR.VOID;

    let attachments = characters.map(character => {
        let {characterBase, emblemPath, characterLevel, subclass} = character;
        let {
            dateLastPlayed,
            minutesPlayedThisSession,
            minutesPlayedTotal,
            powerLevel,
            raceHash,
            genderHash,
            classHash
        } = characterBase;
        let lastSessionPlayTime = _minutesConversion(+minutesPlayedThisSession),
            overallPlayTime = _minutesConversion(+minutesPlayedTotal);

        dateLastPlayed = new Date(dateLastPlayed);

        return util.slack.formatAttachment({
            title: `Level ${characterLevel} - ${RACE_HASH.toString(raceHash)} ${CLASS_HASH.toString(classHash)} - ${GENDER_HASH.toString(genderHash)}`,
            fields: [
                {
                    title: `Last Played`,
                    value: `_${dateLastPlayed.toDateString()}_`,
                    short: true
                },
                {
                    title: `Light Level`,
                    value: `_${powerLevel}_`,
                    short: true
                },
                {
                    title: `Last Session`,
                    value: `*${lastSessionPlayTime.days}* days *${lastSessionPlayTime.hours}* hours *${lastSessionPlayTime.minutes}* minutes`,
                    short: true
                },
                {
                    title: `Overall Play Time`,
                    value: `*${overallPlayTime.days}* days *${overallPlayTime.hours}* hours *${overallPlayTime.minutes}* minutes`,
                    short: true
                }
            ],
            color: damageTypeColor[subclass.damageTypeHash],
            thumb_url: `http://bungie.net${emblemPath}`
        })
    });

    return {
        attachments
    };
}

function _minutesConversion(minutes) {
    let hours = Math.floor(minutes / 60),
        days = Math.floor(hours / 24);

    minutes = minutes % 60;

    hours -= days * 24;

    return {
        days,
        hours,
        minutes
    }
}

export default new BotAction({
    command,
    respondsTo,
    action,
    description,
    grouping: COMMAND_GROUPING.INFO,
    paramRegex
})