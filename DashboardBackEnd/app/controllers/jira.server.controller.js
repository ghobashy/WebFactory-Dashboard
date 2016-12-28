'use strict';

var config = require('../../config/config.js'),
    _ = require('lodash'),
    https = require('https'),
    http = require('http'),
    chalk = require('chalk'),
    request = require('request'),
    jira = require('nodejs-jira-wrapper')({
        username: 'mahmoud.elzouhery@vodafone.com',
        password: 'Maged221289!!',
        url: 'https://jira.sp.vodafone.com/rest/api/2/'
    }),
    Client = require('node-rest-client').Client,
    excel = require('exceljs'),
    jiraBaseUrl = 'https://jira.sp.vodafone.com/rest/api/2/',
    teamsController = require("../../app/controllers/team.server.controller"),
    resourcesController = require("../../app/controllers/resource.server.controller");


exports.listAllProjects = function(req, res) {
    console.log("Get All Projects");
    var options = {
        id: 'OPS'
    }
    jira.projects.get(options, function(error, body) {
        // console.log("Callback ", error, body);
        if (error) {
            // throw some error 
            throw new 'jira api wrapper failed'
        } else {
            res.json(body);
        }
    });
};

exports.getCalendar = function(req, res) {
    console.log("Load Calendar");
    var tempDate = new Date();
    var calendarId = req.params["calendarId"];
    var start = new Date(req.params["startDate"]);
    var end = new Date(req.params["endDate"]);
    console.log("https://confluence.sp.vodafone.com/rest/calendar-services/1.0/calendar/events.json?subCalendarId=" + calendarId + "&userTimeZoneId=Egypt&start=" + start.toISOString().replace(".000", "") + "&end=" + end.toISOString().replace(".000", ""));
    request({
        uri: "https://confluence.sp.vodafone.com/rest/calendar-services/1.0/calendar/events.json?subCalendarId=" + calendarId + "&userTimeZoneId=Egypt&start=" + start.toISOString().replace(".000", "") + "&end=" + end.toISOString().replace(".000", ""),
        json: true,
        headers: { "Authorization": "Basic bWFobW91ZC5lbHpvdWhlcnlAdm9kYWZvbmUuY29tOk1hZ2VkMjIxMjg5ISE=" }
    }, function(error, response, body) {
        if (error) return console.log(error);
        //console.log(body);
        //populateTeamCapacity(body, start, end);
        return res.send(body);
    });
};

exports.getCalendarsList = function(req, res) {
    var calendarList = [];
    request({
        uri: "https://confluence.sp.vodafone.com/rest/calendar-services/1.0/calendar/subcalendars.json",
        json: true,
        headers: { "Authorization": "Basic bWFobW91ZC5lbHpvdWhlcnlAdm9kYWZvbmUuY29tOk1hZ2VkMjIxMjg5ISE=" }
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

exports.getAllTeams = function(req, res) {
    teamsController.list({}, function(err, teams) {
        if (err) {
            res.send(err);
        } else {
            res.send(teams);
        }
    });
};


// function populateTeamCapacity(body, start, end) {
//     if (!body.events) {
//         return;
//     }
//     var capacitySheet = __dirname + "\\templates\\TeamCapacity.xlsx";
//     var outputFile = __dirname + "\\templates\\TeamCapacity2.xlsx";
//     var workbook = new excel.Workbook();

//     workbook.xlsx.readFile(capacitySheet)
//         .then(function() {
//             var worksheet = workbook.getWorksheet('Sheet1');
//             if (worksheet) {
//                 worksheet.eachRow(function(row, rowNumber) {
//                     if (rowNumber >= 2) {
//                         var rotationDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
//                         var columnId = 2;
//                         var resourceName = row.getCell(1).value;
//                         console.log("Leaves for " + resourceName + " rotationDate:" + rotationDate + " to:" + end);
//                         while (rotationDate <= end) {
//                             worksheet.getRow(1).getCell(columnId).value = new Date(rotationDate.getFullYear(), rotationDate.getMonth(), rotationDate.getDate() + 1);

//                             var resourceVacations = body.events.filter(function(obj) {
//                                 if (obj.invitees && obj.invitees.length > 0) {
//                                     return obj.invitees[0].displayName == resourceName &&
//                                         rotationDate >= new Date(obj.start) &&
//                                         rotationDate <= new Date(obj.end);
//                                 }
//                                 return false;
//                             });

//                             if (resourceVacations.length > 0) {
//                                 row.getCell(columnId).value = 0;
//                             } else if (row.getCell(columnId).value != 0) {
//                                 row.getCell(columnId).value = 1;
//                             }

//                             rotationDate.setDate(rotationDate.getDate() + 1);
//                             columnId++;
//                             //console.log(resourceName + " has " + resourceVacations.length + " leaves");
//                         }

//                     }
//                 });
//             }
//         }).then(function() {
//             return workbook.xlsx.writeFile(outputFile);
//         }).then(function() {
//             console.log("workbook updated " + outputFile);
//         });
// }