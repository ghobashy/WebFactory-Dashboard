/**
 * Module dependencies.
 */
var jira = require("../app/controllers/jira.server.controller");
var resources = require("../app/controllers/resource.server.controller");
var teams = require("../app/controllers/team.server.controller");
var confluence = require("../app/controllers/confluence.server.controller");
var jiraChangeLog = require("../app/controllers/jiraItem.changelog.server.controller");

var appRouter = function(app) {
    app.get("/jira/getCalendar/:calendarId/:startDate/:endDate", confluence.getCalendar);
    app.get("/jira/getCalendarsList", confluence.getCalendarsList);
    app.get("/wf/getAllResources", resources.list);
    app.get("/defects/:user", jiraChangeLog.listUserDefects);
    app.get("/wf/teams", teams.list);
};

module.exports = appRouter;