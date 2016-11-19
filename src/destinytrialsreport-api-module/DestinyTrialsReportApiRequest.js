import {ApiRequest} from 'api-request-base';
import {CONFIG, METHOD} from '../constants';

export default class DestinyTrialsReportApiRequest extends ApiRequest {
    constructor({path, routeBinding, requiredParameters = [], method = METHOD.GET}) {
        super({
            path,
            routeBinding,
            requiredParameters,
            method
        });

        this.setBaseUrl(CONFIG.TRIALS_REPORT.API_URL);
    }

    buildRequest() {
        let request = super.buildRequest();
        let destinyTrialsReportRequest = function destinyTrialsReportRequest() {
            return request(...arguments)
                .then(unwrap)
        }.bind(this);

        return this.appendRequestMetadata(destinyTrialsReportRequest);
    }
}


function unwrap(response) {
    return response && response[0] ? response[0] : response;
}