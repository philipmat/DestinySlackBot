import DestinyTrialsReportApiRequest from '../DestinyTrialsReportApiRequest';

const PARAMETERS = {
    GAMER_TAG: 'gamerTag',
    MEMBERSHIP_ID: 'membershipId'
};

export default {
    archnemesis: new DestinyTrialsReportApiRequest({
        path: `slack/archnemesis/{${PARAMETERS.MEMBERSHIP_ID}}`,
        routeBinding: `:${PARAMETERS.MEMBERSHIP_ID}`,
        requiredParameters: [
            PARAMETERS.MEMBERSHIP_ID
        ]
    }).buildRequest(),
    bestKd: new DestinyTrialsReportApiRequest({
        path: `bestkd/{${PARAMETERS.GAMER_TAG}}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    worstKd: new DestinyTrialsReportApiRequest({
        path: `worstKd/{${PARAMETERS.GAMER_TAG}}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    currentMap: new DestinyTrialsReportApiRequest({
        path: `currentMap`
    }).buildRequest(),
}