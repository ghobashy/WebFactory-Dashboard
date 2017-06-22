/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Skill = mongoose.model('Skills'),
    _ = require('lodash');

exports.get = function(technologyname, callback) {
    Skill.findOne({ technology: technology }, function(err, skill) {
        callback(err, skill);
    });
};

exports.list = function(req, res) {
    console.log("==== Load Skills ====");
    Skill.find().exec(function(err, skillList) {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            console.log("Load Skills OK");
            res.status(200).send(skillList);
        }
    });
};