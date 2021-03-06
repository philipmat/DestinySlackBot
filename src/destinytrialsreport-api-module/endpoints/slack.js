import DestinyTrialsReportApiRequest from '../DestinyTrialsReportApiRequest';

const PARAMETERS = {
    GAMER_TAG: 'gamerTag',
    WEEK_NUMBER: 'weekNumber',
    MEMBERSHIP_ID: 'membershipId'
};

export default {
    lastWeek: new DestinyTrialsReportApiRequest({
        path: `slack/lastWeek/{${PARAMETERS.GAMER_TAG}}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    mixedMaps: new DestinyTrialsReportApiRequest({
        path: `slack/mixedMaps/{${PARAMETERS.GAMER_TAG}}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    poe: new DestinyTrialsReportApiRequest({
        path: `slack/poe/{${PARAMETERS.GAMER_TAG}}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    thisMap: new DestinyTrialsReportApiRequest({
        path: `slack/thisMap/{${PARAMETERS.GAMER_TAG}}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    thisWeek: new DestinyTrialsReportApiRequest({
        path: `slack/thisWeek/{${PARAMETERS.GAMER_TAG}}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    trials: new DestinyTrialsReportApiRequest({
        path: `slack/trials/{${PARAMETERS.GAMER_TAG}}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    trialsWeek: new DestinyTrialsReportApiRequest({
        path: `slack/trials/week/{${PARAMETERS.MEMBERSHIP_ID}}/{${PARAMETERS.WEEK_NUMBER}}`,
        routeBinding: `:${PARAMETERS.MEMBERSHIP_ID}/:${PARAMETERS.WEEK_NUMBER}`,
        requiredParameters: [
            PARAMETERS.MEMBERSHIP_ID,
            PARAMETERS.WEEK_NUMBER
        ]
    }).buildRequest(),
};