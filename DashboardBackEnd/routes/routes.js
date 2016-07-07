'use strict';

/**
 * Module dependencies.
 */
var almClient = require('../app/controllers/almClient.server.controller');

var appRouter = function(app) {
    app.get("/defects/all", almClient.getAllDefects);
    app.get("/defect/:id", almClient.getDefect);
    app.get("/defect/history/:id", almClient.getDefectHistory);
    app.get("/defects/users/:users", almClient.getUsersDefects);
    app.get("/defects/status/:status",almClient.getStatusDefects);
}

module.exports = appRouter;