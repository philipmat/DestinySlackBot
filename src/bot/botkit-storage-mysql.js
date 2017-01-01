'use strict';

var mysql = require('mysql');

module.exports = function (config) {
    if (!config) {
        throw new Error('Need to provide MySQL connection information.');
    }

    var get = function get(tableName, translator) {
        return function (id, callback) {
            var connection = mysql.createConnection(config);
            connection.connect();
            connection.query('SELECT * from ' + tableName + ' where id = ?', [id], function (err, rows, fields) {
                var res = rows[0];
                if (!res) {res = []};
                callback(err, translator(res));
            });
            connection.end();
        };
    };

    var saveUser = function saveUser(tableName) {
        return function (data, callback) {
            var dataToSave = [data.id, data.access_token, JSON.stringify(data.scopes), data.team_id, data.user, JSON.stringify(data.destiny_store)];

            var statement = 'INSERT INTO `' + tableName + '` (\
                      `id`, `access_token`, `scopes`, `team_id`, `user`, `destiny_store`\
                      ) VALUES (\
                          ?, ?, ?, ?, ?, ?\
                      ) ON DUPLICATE KEY UPDATE\
                      `destiny_store` = VALUES(`destiny_store`);'
            save(statement, dataToSave, callback);
        };
    };

    var saveTeam = function saveTeam(tableName) {
        return function (data, callback) {
            var dataToSave = [data.id, data.createdBy, data.name, data.url, data.token, JSON.stringify(data.bot), JSON.stringify(data.twitch_streamers), data.twitch_announcement_channel];

            var statement = 'INSERT INTO `' + tableName + '` (\
                      `id`, `createdBy`, `name`, `url`, `token`, `bot`, `twitch_streamers`, `twitch_announcement_channel`\
                      ) VALUES (\
                          ?, ?, ?, ?, ?, ?, ?, ?\
                      ) ON DUPLICATE KEY UPDATE\
                      `twitch_streamers` = VALUES(`twitch_streamers`), `twitch_announcement_channel` = VALUES(`twitch_announcement_channel`);'
            save(statement, dataToSave, callback);
        };
    };

    var saveChannel = function saveChannel(tableName) {
        return function (data, callback) {
            var dataToSave = { id: data.id };
            var keys = Object.keys(data);
            var json = {};
            for (var i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (key != 'id') {
                    json[key] = data[key];
                }
            }
            dataToSave.json = JSON.stringify(json);

            save('INSERT into ' + tableName + ' SET ?', dataToSave, callback);
        };
    };

    var save = function save(statement, dataToSave, callback) {
        var connection = mysql.createConnection(config);
        connection.connect();
        connection.query(statement, dataToSave, function (err, rows, fields) {
            callback(err);
        });
        connection.end();
    };

    var all = function all(tableName, translator) {
        return function (callback) {
            var connection = mysql.createConnection(config);
            connection.connect();
            connection.query('SELECT * from ' + tableName, function (err, rows, fields) {
                var translatedData = [];
                for (var i = 0; i < rows.length; i++) {
                    translatedData.push(translator(rows[i]));
                }
                callback(err, rows);
            });
            connection.end();
        };
    };

    var dbToUserJson = function dbToUserJson(userDataFromDB) {
        if (userDataFromDB) {
            if (userDataFromDB.scopes) {
                userDataFromDB.scopes = JSON.parse(userDataFromDB.scopes);
            }
            if (userDataFromDB.destiny_store) {
                userDataFromDB.destiny_store = JSON.parse(userDataFromDB.destiny_store);
            }
        }
        return userDataFromDB;
    };

    var dbToTeamJson = function dbToTeamJson(teamDataFromDB) {
        if (teamDataFromDB) {
            if (teamDataFromDB.bot) {
                teamDataFromDB.bot = JSON.parse(teamDataFromDB.bot);
            }
            if (teamDataFromDB.twitch_streamers) {
                teamDataFromDB.twitch_streamers = JSON.parse(teamDataFromDB.twitch_streamers);
            }
        }
        return teamDataFromDB;
    };

    var dbToChannelJson = function dbToChannelJson(input) {
        var output = { id: input.id };
        var json = JSON.parse(input.json);
        var keys = Object.keys(json);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            output[key] = json[key];
        }
        return output;
    };

    var storage = {
        teams: {
            get: get('botkit_team', dbToTeamJson),
            save: saveTeam('botkit_team'),
            all: all('botkit_team', dbToTeamJson)
        },
        channels: {
            get: get('botkit_channel', dbToChannelJson),
            save: saveChannel('botkit_channel'),
            all: all('botkit_channel', dbToChannelJson)
        },
        users: {
            get: get('botkit_user', dbToUserJson),
            save: saveUser('botkit_user'),
            all: all('botkit_user', dbToUserJson)
        }
    };
    return storage;
};