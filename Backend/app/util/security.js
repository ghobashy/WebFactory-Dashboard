'use strict';

var config = require('../../config/config.js'),
    request = require('request');

var authData = {
    client_id: config.appSettings.oauth.clientID,
    client_secret: config.appSettings.oauth.clientKey,
    grant_type: config.appSettings.oauth.grant_type,
    audience: config.appSettings.oauth.audience
}

exports.getAccessToken = function(callback) {
    request({
        method: 'POST',
        url: config.appSettings.oauth.tokenUrl,
        body: JSON.stringify(authData),
        headers: { 'content-type': 'application/json' }
    }, function(err, data) {
        if (data.body) {
            callback(JSON.parse(data.body).access_token);
        } else {
            return "403";
        }
    });
}