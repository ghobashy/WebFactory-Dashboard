'use strict';

var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var config = require('./config/config.js');
var chalk = require('chalk');
var _ = require('lodash');
require('./app/models/defect.server.model');
require('./app/models/defectHistory.server.model');
require('./app/models/user.server.model');
require('./app/models/team.server.model');
require('./app/models/resource.server.model');
// Bootstrap db connection
var db = mongoose.connect(config.appSettings.db, function(err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});

var routes = require("./routes/routes.js")(app);
var server = app.listen(3000, function() {
    console.log("Listening on port %s...", server.address().port);
});