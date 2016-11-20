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

    static unwrap(data) {
        return data && data[0] ? data[0] : data;
    }
    //
    // buildRequest() {
    //     let request = super.buildRequest();
    //     let destinyTrialsReportRequest = function destinyTrialsReportRequest() {
    //         return request(...arguments)
    //             .then(response => {
    //                 console.log(response);
    //             })
    //     }.bind(this);
    //
    //     return this.appendRequestMetadata(destinyTrialsReportRequest);
    // }
}