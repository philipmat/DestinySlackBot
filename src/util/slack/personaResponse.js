import DestinySlackBotError from '../../bot/DestinySlackBotError';
import formatResponse from './formatResponse';
import {ICON, COLOR, BOT_NAME, PERSONA, ERROR_TYPE} from '../../constants';

export default personaResponse;

function personaResponse(text, persona, attachments = []) {
    if(isNaN(persona)) {
        throw new DestinySlackBotError(`personaResponse requires persona parameter`, ERROR_TYPE.MISSING_PARAMETER);
    }
    attachments = attachments instanceof Array ? attachments : [attachments];

    return formatResponse({
        text,
        userName: BOT_NAME[PERSONA.toString(persona)],
        iconUrl: ICON[PERSONA.toString(persona)],
        attachments: attachments.map(attachment => {
            return Object.assign({
                color: COLOR[PERSONA.toString(persona)]
            }, attachment);
        })
    })
}