var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var config = require('./config/config.js');
var chalk = require('chalk');
var _ = require('lodash');
var jwt = require('express-jwt');
var rsaValidation = require('auth0-api-jwt-rsa-validation');
var security = require('./app/util/security');
require('./app/models/team.server.model');
require('./app/models/resource.server.model');
require('./app/models/jiraItem.server.model');
require('./app/models/jiraItem.changelog.model');
require('./app/models/skills.server.model');
require('./app/models/resourceScore.server.model');

var CronJob = require('cron').CronJob;
var notificationController = require('./app/controllers/notification.server.controller');
var jiraController = require('./app/controllers/jira.server.controller');
var resourcesController = require("./app/controllers/resource.server.controller");
var jiraItemsController = require("./app/controllers/jiraItem.server.controller");
var skillsController = require("./app/controllers/skills.server.controller");
var resourceSkillsController = require("./app/controllers/resourceScore.server.controller");

// Bootstrap db connection
var db = mongoose.connect(config.appSettings.db, function(err) {
    if (err) {
        console.error(chalk.red('Could not connect to MongoDB!'));
        console.log(chalk.red(err));
    }
});



var app = express();

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ message: 'Missing or invalid token' });
    }
});

var jwtCheck = jwt({
    secret: rsaValidation(),
    audience: config.appSettings.oauth.audience,
    issuer: config.appSettings.oauth.issuer,
    algorithms: ['RS256']
});
var guard = function(req, res, next) {
    var permission = 'JiraAccess';
    if (!req.user.scope == permission) {
        res.send(403, { message: 'Forbidden' });
    } else {
        next();
    }
};
app.use(jwtCheck);
app.use(guard);

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
    //  security.getAccessToken(function(access_token) { console.log(access_token); });
    process.argv.forEach(function(val, index, array) {
        if (index == 2) {
            switch (val) {
                case ("capacity"):
                    console.log("Start Capacity job");
                    notificationController.SendDailyCapacityReports();
                    break;
                case ("jira"):
                    console.log("Start jira job");
                    jiraItemsController.getLastUpdateDate(function(err, lastUpdatedObj) {
                        if (lastUpdatedObj) {
                            var lastUpdateDate = new Date(lastUpdatedObj.updated);
                            jiraController.setlastUpdatedDateCondition("%26updated>%27" + lastUpdateDate.getFullYear() + "/" + (lastUpdateDate.getMonth() + 1) + "/" + lastUpdateDate.getDate() + " " + lastUpdateDate.getHours() + ":" + lastUpdateDate.getMinutes() + "%27");
                        } else {
                            jiraController.setLastUpdatedDateCondition("");
                        }
                        var resourcesList = resourcesController.list({},
                            function(err, resourceList) {
                                if (err) {
                                    console.log(chalk.red(err));
                                    return;
                                }
                                jiraController.getUserItems(resourceList, 0, 100, function(err) {
                                    if (err) {
                                        console.log(chalk.red(err));
                                    } else {
                                        console.log(chalk.green("Users Issues imported"));
                                    }
                                });
                            });
                    });

                    break;
                case ("skill"):
                    var resourcesList = resourcesController.list({},
                        function(err, resourceList) {
                            if (err) {
                                console.log(chalk.red(err));
                                return;
                            }
                            var skills = skillsController.list({},
                                function(err, skillList) {
                                    if (err) {
                                        console.log(chalk.red(err));
                                        return;
                                    }
                                    resourceList.forEach(function(resource) {
                                        skillList.forEach(function(skill) {
                                            var resourceScore = {
                                                resource: resource._id,
                                                technology: skill._id,
                                            };
                                            if (resource.level == "Intermediate") {
                                                resourceScore.score = skill.intermediateScore;
                                            } else if (resource.level == "Senior") {
                                                resourceScore.score = skill.seniorScore;
                                            } else if (resource.level == "Lead") {
                                                resourceScore.score = skill.leadScore;
                                            }
                                            resourceSkillsController.create(resourceScore, function(err) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                        });

                                    });
                                });
                        });
                    break;
            }
        }
    });


    //15 8 * * 0-4 /root/send_capacity.sh
    var job = new CronJob('00 30 10 * * 0-4', function() {
            /*
             * Runs every weekday (Sunday through Thursday)
             * at 10:30:00 AM. It does not run on Saturday
             * or Friday.
             */
            notificationController.SendDailyCapacityReports();
        }, function() {
            /* This function is executed when the job stops */
        },
        true,
        'Africa/Cairo'
    );

    var job2 = new CronJob('0 */60 * * * *', function() {
            /*
             * Runs hour.
             */
            console.log("Start jira job");
            jiraItemsController.getLastUpdateDate(function(err, lastUpdatedObj) {
                if (lastUpdatedObj) {
                    var lastUpdateDate = new Date(lastUpdatedObj.updated);
                    jiraController.setlastUpdatedDateCondition("%26updated>%27" + lastUpdateDate.getFullYear() + "/" + (lastUpdateDate.getMonth() + 1) + "/" + lastUpdateDate.getDate() + " " + lastUpdateDate.getHours() + ":" + lastUpdateDate.getMinutes() + "%27");
                } else {
                    jiraController.setLastUpdatedDateCondition("");
                }
                var resourcesList = resourcesController.list({},
                    function(err, resourceList) {
                        if (err) {
                            console.log(chalk.red(err));
                            return;
                        }
                        jiraController.getUserItems(resourceList, 0, 100, function(err) {
                            if (err) {
                                console.log(chalk.red(err));
                            } else {
                                console.log(chalk.green("Users Issues imported"));
                            }
                        });
                    });
            });
        }, function() {
            /* This function is executed when the job stops */
        },
        true,
        'Africa/Cairo'
    );
});