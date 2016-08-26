'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Defect = mongoose.model('Defect'),
    _ = require('lodash');

/**
 * Create a defect
 */
exports.create = function (req, callback) {
    Defect.count({id: req.id}, function (err, count) {
        if (err) {
            callback(err);
        }
        if (count == 0) {
            var defect = new Defect(req);
            defect.save(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    console.log('defect saved successfully!');
                }
            });
        }
        else {
            update(req, callback);
        }
    });
};

exports.get = function (id, callback) {
    Defect.findOne({id: id}, function (err, defect) {
        callback(err, defect);
    });
};

function update(record, callback) {
    console.log("update defect id ",record.id);
    Defect.update({id: record.id}, {
        $set: {
            id: record.id,
            name: record.name,
            severity: record.severity,
            priority: record.priority,
            status: record.status,
            owner: record.owner,
            detectedBy: record.detectedBy,
            environment: record.environment,
            defectType: record.defectType,
            creationTime: record.creationTime,
            lastModified: record.lastModified
        }
    }, function (err, result) {
        console.log(result);
        callback(err, result);
    });
};


exports.list = function (callback) {
    console.log("==== Load Defects ====");
    var query = {};
    Defect.find(query).sort({lastModified: -1}).lean().exec(function (err, defectList) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.log("Load Defects OK");
            callback(null, defectList);
        }
    });
};

exports.getLatest = function (callback) {
    Defect.findOne({}, {}, {sort: {lastModified: -1}}, function (err, defect) {
        callback(err, defect);
    });
};