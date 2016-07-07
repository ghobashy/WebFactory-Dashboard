'use strict';

/**
 * Module dependencies.
 */
var almClient = require('../app/controllers/almClient.server.controller');

var appRouter = function(app) {
    app.get("/defects/all", almClient.getAllDefects);
    app.get("/defect/:id", almClient.getDefect);
}

module.exports = appRouter;