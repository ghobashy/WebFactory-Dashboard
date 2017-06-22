/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    JiraItemChangeLog = mongoose.model('JiraItemChangeLog'),
    JiraItemController = require("./jiraItem.server.controller"),
    _ = require('lodash'),
    chalk = require("chalk");

/**
 * Create a Team
 */
exports.create = function(req, callback) {
    JiraItemChangeLog.count({ "id": req.id }, function(err, count) {

        if (err) {
            console.log(err);
            callback(err);
        }
        if (count == 0) {
            var item = new JiraItemChangeLog(req);
            item.save(function(err) {
                if (err) {
                    callback(err);
                } else {
                    console.log(chalk.green('Jira Item changeLog saved successfully!'));
                }
            });
        } else {
            callback("Log Already exist");
        }
    });
};

exports.get = function(filter, callback) {
    JiraItemChangeLog.findOne(filter, function(err, items) {
        callback(err, items);
    });
};


exports.list = function(query, callback) {
    JiraItemChangeLog.find(query).exec(function(err, items) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            callback(null, items);
        }
    });
};

exports.listUserDefects = function(req, res) {
    var user = req.params["user"];
    JiraItemChangeLog.find({ "field": "assignee", "toValue": user }).exec(function(err, items) {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            var defectList = [];
            _.each(items, function(obj, id) {
                JiraItemController.list({ "key": obj.key }, function(err, item) {
                    if (!err) {
                        defectList.push(obj);
                    }
                });
            });
            res.send(items);
        }
    });
};

// exports.getTeamMemberStats = function(req, res) {
//     var user = req.params.user;
//     JiraItemChangeLog.find({ "field": "assignee", "toValue": user }).exec(function(err, items) {
//         if (err) {
//             console.error(err);
//             res.status(500).send(err);
//         } else {
//             var defectList = [];
//             _.each(items, function(obj, id) {
//                 JiraItemController.list({ "key": obj.key }, function(err, item) {
//                     if (!err) {
//                         defectList.push(obj);
//                     }
//                 });
//             });
//             res.send(items);
//         }
//     });
// };