'use strict';

/**
 * Module dependencies.
 */
var almClient = require('../app/controllers/almClient.server.controller');
var defects = require('../app/controllers/defect.server.controller');
var users = require('../app/controllers/user.server.controller');
var init = require('../init');

var appRouter = function(app) {
    app.get("/alm/all", almClient.getAllDefects);
    app.get("/alm/update", almClient.updatedDatabase);
    app.get("/alm/users/all", almClient.getAllUsers);
    app.get("/alm/:id", almClient.getDefect);
    app.get("/alm/history/:id", almClient.getDefectHistory);
    app.get("/alm/users/:users", almClient.getUsersDefects);
    app.get("/alm/status/:status",almClient.getStatusDefects);
};

module.exports = appRouter;