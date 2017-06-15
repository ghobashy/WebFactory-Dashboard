var config = require('../../config/config.js'),
    _ = require('lodash'),
    fs = require('fs'),
    http = require('http'),
    chalk = require('chalk'),
    request = require('request'),
    util = require('../util/util'),
    security = require('../util/security'),
    teamsController = require("../../app/controllers/team.server.controller"),
    resourcesController = require("../../app/controllers/resource.server.controller"),
    jiraItemsController = require("../../app/controllers/jiraItem.server.controller"),
    jiraItemsChangeLogController = require("../../app/controllers/jiraItem.changelog.server.controller");

var getUserItems = exports.getUserItems = function(usersList, startAt, maxResults, callback) {
    console.log("Load User Items");
    if (usersList.length === 0) {
        return callback(null);
    }
    var user = usersList.pop();
    var url = config.appSettings.jira.jiraBaseUrl + "search?jql=assignee%3D\"" + user.email + "\"%26project%3DWF&fields=summary,status,customfield_10212,priority,customfield_12938,customfield_18284,issuetype,created,updated,components&expand=changelog&startAt=" + startAt + "&maxResults=" + maxResults;
    console.log(url);
    fs.appendFile('app/templates/info.log', url + "\r\n", { encoding: 'utf-8' });
    request({
        uri: url,
        json: true,
        headers: { "Authorization": config.appSettings.jira.authCode }
    }, function(error, response, body) {
        if (error) {
            callback(error);
        }
        _.each(body.issues, function(obj, id) {
            var itemObj = {
                key: obj.key,
                summary: obj.fields.summary,
                status: obj.fields.status ? obj.fields.status.name : "",
                priority: obj.fields.priority ? obj.fields.priority.name : "",
                severity: obj.fields.customfield_12938 ? obj.fields.customfield_12938.value : "",
                affecting: obj.fields.customfield_18284 ? obj.fields.customfield_18284.value : "",
                issuetype: obj.fields.issuetype ? obj.fields.issuetype.name : "",
                storyPoints: obj.fields.customfield_10212,
                created: obj.fields.created,
                updated: obj.fields.updated,
                userAssigned: user.name,
            };
            jiraItemsController.create(itemObj, function(err) { callback(err); });

            if (obj.changelog.histories && obj.changelog.histories.length > 0) {
                for (var j = 0; j < obj.changelog.histories.length; j++) {
                    var history = obj.changelog.histories[j];
                    if (history.items && history.items.length > 0) {
                        for (var i = 0; i < history.items.length; i++) {
                            if (history.items[i].field == "assignee" || history.items[i].field == "status") {
                                jiraItemsChangeLogController.create({
                                    id: history.id,
                                    key: obj.key,
                                    author: history.author.name,
                                    created: history.created,
                                    field: history.items[i].field,
                                    fromValue: history.items[i].fromString,
                                    toValue: history.items[i].toString
                                }, function(err) { callback(err); });
                            }

                        }
                    }
                }
            }
        });

        if (body.maxResults < body.total) {
            usersList.push(user);
            getUserItems(usersList, maxResults + 1, maxResults + 101, callback);
        } else {
            getUserItems(usersList, 0, 100, callback);
        }
    });
};