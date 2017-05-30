'use strict';

var config = require('../../config/config.js'),
    fs = require('fs'),
    http = require('http'),
    chalk = require('chalk'),
    request = require('request'),
    util = require('../util/util'),
    teamsController = require("../../app/controllers/team.server.controller"),
    resourcesController = require("../../app/controllers/resource.server.controller"),
    confluenceController = require("../../app/controllers/confluence.server.controller"),
    helper = require('sendgrid').mail,
    wfResources = [],
    wfTeams = [];


exports.SendDailyCapacityReports = function() {
    var calendars = config.appSettings.jira.calendars.slice(0);
    var startDate = new Date();
    startDate.setHours(2, 0, 0, 0);
    var endDate = new Date();
    endDate.setHours(1, 59, 59, 0);
    endDate = new Date(endDate.setDate(endDate.getDate() + 1));

    confluenceController.eventList = [];
    wfResources = [];
    wfTeams = [];

    resourcesController.list({}, function(error, resources) {
        if (error) {
            console.log(error);
            return;
        }
        wfResources = resources;
        teamsController.list({}, function(err, teams) {
            if (err) {
                console.log(error);
                return;
            }
            wfTeams = teams;
            renderReportContent(calendars, startDate.toISOString(), endDate.toISOString(), wfResources);
        });
    });



};

function renderReportContent(calendars, startDate, endDate, wfResources) {
    confluenceController.getCalendarEvents(calendars, startDate, endDate, wfResources, function(response) {
        var calendarEvents = response;
        // fs.writeFileSync('app/templates/events' + new Date().toISOString().replace(/:/g, "-") + '.json', JSON.stringify(response), { encoding: 'utf-8' });
        // console.log("Saved Calendar events");
        // return;
        var wfhEvents = calendarEvents.filter(function(obj) {
            return obj.calendarId == "WFH";
        });
        var wfReleaseEvents = calendarEvents.filter(function(obj) {
            return obj.calendarId == "WebFactory Events";
        });
        var vacationEvents = calendarEvents.filter(function(obj) {
            return obj.calendarId == "Vacations";
        });
        var wfTrainingEvents = calendarEvents.filter(function(obj) {
            return obj.calendarId == "Trainings";
        });

        var template = fs.readFileSync('app/templates/EmailTemplate.html', { encoding: 'utf-8' });
        var today = new Date();
        template = template.replace("[DATE]", today.getDate() + "<sup>" + util.getDateOrdinal(today.getDate()) + "</sup> " + util.getMonthName(today.getMonth()) + " " + today.getFullYear());
        if (wfhEvents && wfhEvents.length == 0 || !wfhEvents) {
            template = template.replace(/\[SHOW_WFH_EV\]/g, "display:none;");
            console.log("WFH Table visibility: None");
        } else {
            template = template.replace(/\[SHOW_WFH_EV\]/g, "");
            template = template.replace("[APLHA_WFH_EV]", confluenceController.getEventMembers("Alpha", wfhEvents));
            template = template.replace("[BRAVO_WFH_EV]", confluenceController.getEventMembers("Bravo", wfhEvents));
            template = template.replace("[CHARLY_WFH_EV]", confluenceController.getEventMembers("Charly", wfhEvents));
            template = template.replace("[WFH_EV]", "<tr><td colspan='3'>" + confluenceController.getGeneralEvent(wfhEvents) + "</td></tr>");

        }
        if (wfReleaseEvents && wfReleaseEvents.length == 0 || !wfReleaseEvents) {
            template = template.replace(/\[SHOW_WF_EV\]/g, "display:none;");
            console.log("WF Releases Table visibility: None");
        } else {
            template = template.replace(/\[SHOW_WF_EV\]/g, "");
            template = template.replace("[WF_EV]", confluenceController.getGeneralEvent(wfReleaseEvents));
        }
        if (vacationEvents && vacationEvents.length == 0 || !vacationEvents) {
            template = template.replace(/\[SHOW_VAC_EV\]/g, "display:none;");
            console.log("Vacations Table visibility: None");
        } else {
            template = template.replace(/\[SHOW_VAC_EV\]/g, "");
            template = template.replace("[APLHA_VAC_EV]", confluenceController.getEventMembers("Alpha", vacationEvents));
            template = template.replace("[BRAVO_VAC_EV]", confluenceController.getEventMembers("Bravo", vacationEvents));
            template = template.replace("[CHARLY_VAC_EV]", confluenceController.getEventMembers("Charly", vacationEvents));
            template = template.replace("[VAC_EV]", "<tr><td colspan='3'>" + confluenceController.getGeneralEvent(vacationEvents) + "</td></tr>");

        }
        if (wfTrainingEvents && wfTrainingEvents.length == 0 || !wfTrainingEvents) {
            template = template.replace(/\[SHOW_TR_EV\]/g, "display:none;");
            console.log("Training Releases Table visibility: None");
        } else {
            template = template.replace(/\[SHOW_TR_EV\]/g, "");
            template = template.replace("[APLHA_TR_EV]", confluenceController.getEventMembers("Alpha", wfTrainingEvents));
            template = template.replace("[BRAVO_TR_EV]", confluenceController.getEventMembers("Bravo", wfTrainingEvents));
            template = template.replace("[CHARLY_TR_EV]", confluenceController.getEventMembers("Charly", wfTrainingEvents));
            template = template.replace("[TR_EV]", "<tr><td colspan='3'>" + confluenceController.getGeneralEvent(wfTrainingEvents) + "</td></tr>");
        }
        //fs.writeFileSync('app/templates/EmailTemplate' + new Date().toISOString().replace(/:/g, "-") + '.html', template, { encoding: 'utf-8' });
        //console.log("Report Written on disk");
        sendEmail(template);
    });
}

function sendEmail(content) {
    var leads = wfResources.filter(function(obj) {
        return obj.role == "PM" || obj.role == "Dev Lead" || obj.role == "Test Manager";
    });
    var leadsEmails = [];

    for (var i = 0; i < leads.length; i++) {
        leadsEmails.push(new helper.Email(leads[i].email, leads[i].name));
    }
    leadsEmails.push(new helper.Email("Enas.Nasr@vodafone.com", "Enas Nasr"));
    //leadsEmails.push(new helper.Email("mahmoud.elzouhery@vodafone.com", "Mahmoud El-Zouhery"));
    console.log(leadsEmails);

    var today = new Date();
    var subject = "WF teams availability report " + util.getDayName(today.getDay()) + " " + today.getDate() + " " + util.getMonthName(today.getMonth()) + " " + today.getFullYear();
    var content = new helper.Content("text/html", content);
    var from_email = new helper.Email("WF-Reporting@vsse.com");

    var sg = require('sendgrid')(config.appSettings.sendGrid.apiPassword);
    var request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: {
            personalizations: [{
                to: leadsEmails,
                subject: subject,
            }, ],
            from: from_email,
            content: [content],
        },
    });

    //With callback
    sg.API(request, function(error, response) {
        if (error) {
            console.log('Error response received');
        }
        console.log(response.statusCode);
        console.log(response.body);
        console.log(response.headers);
        process.exit();
    });
};