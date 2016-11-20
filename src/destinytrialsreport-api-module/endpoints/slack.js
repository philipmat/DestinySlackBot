import DestinyTrialsReportApiRequest from '../DestinyTrialsReportApiRequest';

const PARAMETERS = {
    GAMER_TAG: 'gamerTag'
};

let endpoints = {};

function generateRequests(requestMetaInfo) {
    requestMetaInfo.forEach(info => {
        endpoints[info.name] = new DestinyTrialsReportApiRequest({
            path: `${info.basePath}/{${PARAMETERS.GAMER_TAG}}`,
            routeBinding: `:${PARAMETERS.GAMER_TAG}`,
            requiredParameters: [
                PARAMETERS.GAMER_TAG
            ]
        }).buildRequest();
    });
}

generateRequests([
    {
        name: 'thisMap',
        basePath: 'slack/thisMap'
    },
    {
        name: 'thisWeek',
        basePath: 'slack/thisWeek'
    },
    {
        name: 'lastWeek',
        basePath: 'slack/lastWeek'
    },
    {
        name: 'mixedMaps',
        basePath: 'slack/mixedMaps'
    },
    {
        name: 'trials',
        basePath: 'slack/trials'
    },
    {
        name: 'poe',
        basePath: 'slack/poe'
    }
]);

export default endpoints;