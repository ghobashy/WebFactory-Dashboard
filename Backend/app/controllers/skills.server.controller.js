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

exports.list = function(query, callback) {
    console.log("==== Load Skills ====");
    Skill.find(query).exec(function(err, skillList) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.log("Load Skills OK");
            callback(null, skillList);
        }
    });
};