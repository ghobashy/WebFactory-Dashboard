
/**
 * Module dependencies.
 */

var validate = require('express-validation');
var jira = require("../app/controllers/jira.server.controller");
var resources = require("../app/controllers/resource.server.controller");
var teams = require("../app/controllers/team.server.controller");
var confluence = require("../app/controllers/confluence.server.controller");
var jiraChangeLog = require("../app/controllers/jiraItem.changelog.server.controller");
var resourceScoreController = require("../app/controllers/resourceScore.server.controller");
var skills = require("../app/controllers/skills.server.controller");
var skillsValidator = require("../app/validators/skills.server.validator");

var appRouter = function (app) {
    app.get("/jira/getCalendar/:calendarId/:startDate/:endDate", confluence.getCalendar);
    app.get("/jira/getCalendarsList", confluence.getCalendarsList);
    app.get("/wf/getAllResources", resources.list);
    app.get("/defects/:user", jiraChangeLog.listUserDefects);
    app.get("/wf/teams", teams.list);
    app.get("/wf/teamMembers/:team", resources.getTeamMembers);
    app.get("/wf/skillMatrix/:resource?", resourceScoreController.list);
    app.get("/wf/skills", skills.list);
    app.post("/wf/skills", validate(skillsValidator.createSkill), skills.create);
    app.put("/wf/skills/:skill", validate(skillsValidator.updateSkill), skills.update);
    app.delete("/wf/skills/:skill", skills.remove);
};

module.exports = appRouter;