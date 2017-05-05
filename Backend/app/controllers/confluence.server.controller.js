'use strict';

var config = require('../../config/config.js'),
    _ = require('lodash'),
    fs = require('fs'),
    http = require('http'),
    chalk = require('chalk'),
    request = require('request'),
    util = require('../util/util'),
    security = require('../util/security');

var eventList = exports.eventList = [];

exports.getCalendar = function(req, res) {
    console.log("Load Calendar");
    var calendarId = req.params["calendarId"];
    var start = new Date(req.params["startDate"]).toISOString();
    var end = new Date(req.params["endDate"]).toISOString();

    console.log(config.appSettings.jira.calendarService + "events.json?subCalendarId=" + calendarId + "&userTimeZoneId=Egypt&start=" + start.substring(0, start.lastIndexOf('.')) + "Z&end=" + end.substring(0, end.lastIndexOf('.')) + "Z");
    request({
        uri: config.appSettings.jira.calendarService + "events.json?subCalendarId=" + calendarId + "&userTimeZoneId=Egypt&start=" + start.substring(0, start.lastIndexOf('.')) + "Z&end=" + end.substring(0, end.lastIndexOf('.')) + "Z",
        json: true,
        headers: { "Authorization": config.appSettings.jira.authCode }
    }, function(error, response, body) {
        if (error) {
            return console.log("error:====>" + error);
        };
        return res.send(body);
    });
};

exports.getCalendarsList = function(req, res) {
    var calendarList = [];
    request({
        uri: config.appSettings.jira.calendarService + "subcalendars.json",
        json: true,
        headers: { "Authorization": config.appSettings.jira.authCode }
    }, function(error, response, body) {
        if (error) return res.send(error);
        if (body) {
            _.each(body.payload, function(obj, id) {
                if (obj.childSubCalendars.length > 0) {
                    for (var i = 0; i < obj.childSubCalendars.length; i++) {
                        calendarList.push({
                            name: obj.childSubCalendars[i].subCalendar.name,
                            type: obj.childSubCalendars[i].subCalendar.typeKey,
                            id: obj.childSubCalendars[i].subCalendar.id
                        });
                    }
                }
            });
            return res.send(calendarList);
        }
    });
};

var getCalendarEvents = exports.getCalendarEvents = function(calendarList, startDate, endDate, wfResources, callback) {
    security.getAccessToken(function(access_token) {
        if (access_token != "403") {
            //console.log(access_token);
            if (calendarList.length > 0) {
                var calendar = calendarList.pop();
                var options = {
                    host: "localhost",
                    port: config.appSettings.port,
                    path: '/jira/getCalendar/' + calendar.id + '/' + startDate + '/' + endDate,
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + access_token }
                };

                http.request(options, function(res) {
                    var output = '';
                    if (res.statusCode == 401) {
                        console.log(chalk.red(res.statusCode + ":" + res.statusMessage));
                        return;
                    }
                    res.setEncoding('utf8');
                    res.on('data', function(chunk) {
                        output += chunk;
                    });
                    res.on('end', function(err, data) {
                        //console.log(output);
                        try {

                            var calendarEvent = JSON.parse(output);
                            if (calendarEvent.events) {
                                for (var i = 0; i < calendarEvent.events.length; i++) {
                                    var event = calendarEvent.events[i];
                                    var eventStartDate = new Date(event.start);
                                    var timeZoneOffset = eventStartDate.getTimezoneOffset();
                                    eventStartDate = new Date(eventStartDate.setMinutes(timeZoneOffset * -1));
                                    var eventEndDate = new Date(event.end);
                                    eventEndDate = new Date(eventEndDate.setMinutes(timeZoneOffset * -1));
                                    if (new Date(startDate) >= eventStartDate && (new Date(endDate) <= eventEndDate || new Date(startDate) >= eventEndDate)) {
                                        if (event.invitees && event.invitees.length > 0) {
                                            for (var j = 0; j < event.invitees.length; j++) {
                                                var resourceObj = wfResources.filter(function(obj) {
                                                    return obj.email.toLowerCase() == event.invitees[j].email.toLowerCase();
                                                });
                                                if (resourceObj && resourceObj.length > 0) {
                                                    event.invitees[j].team = resourceObj[0].team;
                                                    console.log(event.invitees[j].team[0] + " - " + event.invitees[j].displayName);

                                                } else {
                                                    console.log("Team Member not found ", event.invitees[j].email.toLowerCase());
                                                }
                                            }
                                        }
                                        eventList.push({
                                            calendarId: calendar.name,
                                            title: event.title,
                                            description: event.description,
                                            start: event.start,
                                            end: event.end,
                                            invitees: event.invitees
                                        });
                                    }
                                }
                            }
                        } catch (e) {
                            console.log(e);
                        }

                        getCalendarEvents(calendarList, startDate, endDate, wfResources, callback);
                    });
                }).end();
            } else {
                callback(eventList);
            }
        } else {
            console.log(chalk.red("UnAuthorized"));
        }
    });

};

exports.getEventMembers = function(team, eventList) {
    var members = "";
    for (var i = 0; i < eventList.length; i++) {
        var event = eventList[i];
        if (!event.invitees || event.invitees.length == 0) {
            continue;
        }
        for (var j = 0; j < event.invitees.length; j++) {
            if (event.invitees[j].team && event.invitees[j].team.indexOf(team) > -1) {
                var description = "";
                if (event.description && event.description != '') {
                    description = " (" + event.description + ")";
                }
                members += event.invitees[j].displayName + description + "<br/>";
            }
        }
    }
    return members;
};


exports.getGeneralEvent = function(eventList) {
    var titles = "<ul>";
    var description = "";
    for (var i = 0; i < eventList.length; i++) {
        var event = eventList[i];
        if (!event.invitees || event.invitees.length == 0) {
            if (event.description && event.description != '') {
                description = " (" + event.description + ")";
            }
            titles += "<li>" + event.title + description + "</li>";
        }
    }
    return titles + "</ul>";
};