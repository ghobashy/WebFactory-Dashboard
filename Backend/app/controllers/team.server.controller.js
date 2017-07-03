/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Team = mongoose.model('Teams'),
    _ = require('lodash');

/**
 * Create a Team
 */
exports.create = function(req, callback) {
    Team.count({ name: req.name }, function(err, count) {
        if (err) {
            callback(err);
        }
        if (count == 0) {
            var Team = new Team(req);
            Team.save(function(err) {
                if (err) {
                    callback(err);
                } else {
                    console.log('Team saved successfully!');
                }
            });
        } else {
            update(req, callback);
        }
    });
};

exports.get = function(name, callback) {
    Team.findOne({ name: name }, function(err, team) {
        callback(err, team);
    });
};

function update(record, callback) {
    console.log("update Team id ", record.id);
    Team.update({ name: record.name }, {
        $set: {
            name: record.name,
            techLead: record.techLead,
            pm: record.pm
        }
    }, function(err, result) {
        console.log(result);
        callback(err, result);
    });
};


exports.list = function(req, res) {
    getAll({}, function(err, teams) {
        if (err) {
            console.log(error);
            res.status(500).send(error);
        }
        res.status(200).send(teams);
    });
};

var getAll = exports.getAll = function(query, callback) {
    console.log("==== Load Teams ====");
    Team.find(query).exec(function(err, teamList) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.log("Load Teams OK");
            callback(null, teamList);
        }
    });
};