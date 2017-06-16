/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    JiraItem = mongoose.model('JiraItem'),
    _ = require('lodash'),
    chalk = require("chalk");

/**
 * Create a Team
 */
exports.create = function(req, callback) {
    JiraItem.count({ "key": req.key }, function(err, count) {
        console.log("Count Called");
        if (err) {
            console.log(err);
            callback(err);
        }
        if (count == 0) {
            var item = new JiraItem(req);
            item.save(function(err) {
                if (err) {
                    callback(err);
                } else {
                    console.log(chalk.green('Jira Item saved successfully!'));
                }
            });
        } else {
            update(req, callback);
        }
    });
};

exports.get = function(filter, callback) {
    JiraItem.findOne(filter, function(err, items) {
        callback(err, items);
    });
};
exports.getLastUpdateDate = function(callback) {
    JiraItem.findOne().sort({ updated: 'descending' }).exec(function(err, items) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            callback(null, items);
        }
    });
};

function update(record, callback) {
    console.log("update Jira Item id ", record.key);
    JiraItem.update({ key: record.key }, {
        $set: {
            summary: record.summary,
            status: record.status,
            priority: record.priority,
            severity: record.severity,
            affecting: record.affecting,
            issuetype: record.issuetype,
            components: record.components,
            storyPoints: record.storyPoints,
            created: record.created,
            updated: record.updated
        }
    }, function(err, result) {
        console.log(result);
        callback(err, result);
    });
};


exports.list = function(query, callback) {
    console.log("==== Load Teams ====");
    JiraItem.find(query).exec(function(err, items) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.log("Load Teams OK");
            callback(null, items);
        }
    });
};