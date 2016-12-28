'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Resource = mongoose.model('Resource'),
    _ = require('lodash');

/**
 * Create a Resource
 */
exports.create = function(req, callback) {
    Resource.count({ email: req.email }, function(err, count) {
        if (err) {
            callback(err);
        }
        if (count == 0) {
            var Resource = new Resource(req);
            Resource.save(function(err) {
                if (err) {
                    callback(err);
                } else {
                    console.log('Resource saved successfully!');
                }
            });
        } else {
            update(req, callback);
        }
    });
};

exports.get = function(email, callback) {
    Resource.findOne({ email: email }, function(err, Resource) {
        callback(err, Resource);
    });
};

function update(record, callback) {
    console.log("update Resource id ", record.id);
    Resource.update({ email: record.email }, {
        $set: {
            name: record.name,
            email: record.email,
            team: record.team
        }
    }, function(err, result) {
        console.log(result);
        callback(err, result);
    });
};


exports.list = function(query, callback) {
    console.log("==== Load Resources ====");
    Resource.find(query).sort({ name: 1 }).lean().exec(function(err, ResourceList) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.log("Load Resources OK");
            callback(null, ResourceList);
        }
    });
};