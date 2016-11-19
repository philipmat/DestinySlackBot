import DestinyTrialsReportApiRequest from '../DestinyTrialsReportApiRequest';

const PARAMETERS = {
    GAMER_TAG: 'gamerTag'
};

export default {
    archnemesis: new DestinyTrialsReportApiRequest({
        path: `archnemesis/${PARAMETERS.GAMER_TAG}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    bestKd: new DestinyTrialsReportApiRequest({
        path: `bestkd/${PARAMETERS.GAMER_TAG}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    worstKd: new DestinyTrialsReportApiRequest({
        path: `worstKd/${PARAMETERS.GAMER_TAG}`,
        routeBinding: `:${PARAMETERS.GAMER_TAG}`,
        requiredParameters: [
            PARAMETERS.GAMER_TAG
        ]
    }).buildRequest(),
    currentMap: new DestinyTrialsReportApiRequest({
        path: `currentMap`
    }).buildRequest(),
}