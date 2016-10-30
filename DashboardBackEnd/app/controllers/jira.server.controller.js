'use strict';

var config = require('../../config/config.js'),
    _ = require('lodash'),
    https = require('https'),
    http = require('http'),
    chalk = require('chalk'),
    request = require('request'),
    jira = require('nodejs-jira-wrapper')({
        username: 'mahmoud.elzouhery@vodafone.com',
        password: '',
        url: 'https://jira.sp.vodafone.com/rest/api/2/'
    }),
    Client = require('node-rest-client').Client,
    excel = require('exceljs');


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
    var start = new Date(2016, 10, 1);
    var end = new Date(2016, 10, 30);


    var capacitySheet = __dirname + "\\templates\\TeamCapacity.xlsx";
    var outputFile = __dirname + "\\templates\\TeamCapacity2.xlsx";
    var workbook = new excel.Workbook();

    var todayLeaves = 0;
    var membersOnLeave = [];
    request({
        uri: "https://confluence.sp.vodafone.com/rest/calendar-services/1.0/calendar/events.json?subCalendarId=0ce24d8e-0ed9-4f02-bafc-ad8ef4bdadf2&userTimeZoneId=Egypt&start=" + start.toISOString().replace(".000", "") + "&end=" + end.toISOString().replace(".000", ""),
        json: true,
        headers: { "Authorization": "Basic " }
    }, function(error, response, body) {
        if (error) return console.log(error);

        workbook.xlsx.readFile(capacitySheet)
            .then(function() {
                var worksheet = workbook.getWorksheet('Sheet1');
                if (worksheet) {
                    worksheet.eachRow(function(row, rowNumber) {
                        if (rowNumber >= 2) {
                            var rotationDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                            var columnId = 2;
                            var resourceName = row.getCell(1).value;
                            //console.log("Leaves for " + resourceName + " rotationDate:" + rotationDate + " to:" + end);
                            while (rotationDate <= end) {
                                var resourceVacations = body.filter(function(obj) {
                                    return obj.invitees[0].displayName == resourceName &&
                                        rotationDate >= new Date(obj.start) &&
                                        rotationDate <= new Date(obj.end);
                                });
                                if (resourceVacations.length > 0) {
                                    row.getCell(columnId).value = 0;
                                } else {
                                    row.getCell(columnId).value = 1;
                                }

                                rotationDate.setDate(rotationDate.getDate() + 1);
                                columnId++;
                                //console.log(resourceName + " has " + resourceVacations.length + " leaves");
                            }

                        }
                    });
                }
            }).then(function() {
                return workbook.xlsx.writeFile(outputFile);
            }).then(function() {
                console.log("workbook updated " + outputFile);
            });
        return res.send(body);
    });
};

/*   if (today >= new Date(obj.start) && today <= new Date(obj.end)) {
                todayLeaves++;
                membersOnLeave.push(obj.invitees[0].displayName);
            } */