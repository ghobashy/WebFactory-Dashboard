'use strict';

/**
 * Module dependencies.
 */
var almClient = require('../app/controllers/almClient.server.controller');
var defects = require('../app/controllers/defect.server.controller');
var users = require('../app/controllers/user.server.controller');
var jira = require("../app/controllers/jira.server.controller");
var resources = require("../app/controllers/resource.server.controller");
var teams = require("../app/controllers/team.server.controller");
var init = require('../init');

var appRouter = function(app) {
    app.get("/alm/all", almClient.getAllDefects);
    app.get("/alm/update", almClient.updatedDatabase);
    app.get("/alm/users/all", almClient.getAllUsers);
    app.get("/alm/:id", almClient.getDefect);
    app.get("/alm/history/:id", almClient.getDefectHistory);
    app.get("/alm/users/:users", almClient.getUsersDefects);
    app.get("/alm/status/:status", almClient.getStatusDefects);
    app.get("/alm/history/:startDate/:endDate", almClient.getPeriodHistory);
    app.get("/alm/test/listFolder", almClient.getTestCases);
    app.get("/jira/projects", jira.listAllProjects);
    app.get("/jira/getCalendar/:calendarId/:startDate/:endDate", jira.getCalendar);
    app.get("/jira/getCalendarsList", jira.getCalendarsList);
    app.get("/wf/getAllTeams", jira.getAllTeams);
    app.get("/wf/getAllResources", resources.list);
};

module.exports = appRouter;