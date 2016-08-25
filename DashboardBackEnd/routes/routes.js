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
    app.get("/alm/users/all", almClient.getAllUsers);
    app.get("/alm/:id", almClient.getDefect);
    app.get("/alm/history/:id", almClient.getDefectHistory);
    app.get("/alm/users/:users", almClient.getUsersDefects);
    app.get("/alm/status/:status",almClient.getStatusDefects);

    app.route('/defects')
        .get(defects.list)
        .post(defects.create);

    app.route('/defects/:defectId')
        .get(defects.read)
        .put(defects.update)
        .delete(defects.delete);

    app.route('/users')
        .get(users.list)
        .post(users.create);

    app.route('/users/:userId')
        .get(users.read)
        .put(users.update)
        .delete(users.delete);

    app.get("/init", init.InitDatabase);
    // Finish by binding the article middleware
    app.param('defectId', defects.defectByID);
    app.param('userId', users.userByID);

}

module.exports = appRouter;