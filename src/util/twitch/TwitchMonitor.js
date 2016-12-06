import twitch from 'mrdandandan-twitch-module';

export default class TwitchMonitor {
    constructor() {

    }

    static checkOnlineStreamsFor(streamers = []) {
        let promises;

        promises = streamers.map(streamer => {
            return twitch.streams(streamer.channel)
                .then(response => {
                    response.streamer = streamer;
                    return response;
                });
        });

        return Promise.all(promises)
            .then(responses => {
                return responses.reduce((output, response) => {
                    if (response.stream) {
                        output.push({
                            streamer: response.streamer,
                            stream: response.stream
                        });
                    }

                    return output;
                }, []);
            });
    }
}