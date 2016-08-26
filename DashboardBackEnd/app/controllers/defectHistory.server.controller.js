'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    DefectHistory = mongoose.model('DefectHistory'),
    _ = require('lodash');

/**
 * Create a defectHistory
 */
exports.create = function (req, res) {
    var query = {Id: req.Id};

    DefectHistory.count(query, function (err, count) {
        if (count == 0) {
            var defectHistory = new DefectHistory(req);

            defectHistory.save(function (err) {
                if (err) throw err;
                console.log('defect History saved successfully!');
            });
        }
        else {
            console.log('defect History already exist!');
        }
    });
};


exports.get = function (id, callback) {
    DefectHistory.find({defectId: id}, null, {sort: 'time'}, function (err, defectHistory) {
        callback(err, defectHistory);
    });
};


exports.update = function (record, callback) {
    DefectHistory.update({_id: record._id}, {
        $set: {
            Id: record.Id,
            defectId: record.defectId,
            username: record.username,
            time: record.time,
            oldValue: record.oldValue,
            newValue: record.newValue
        }
    }, function (err, result) {
        callback(err);
    });
};

exports.list = function (callback) {
    console.log("==== Load Defects ====");
    var query = {};
    DefectHistory.find(query).sort({time: 1}).lean().exec(function (err, defectHistoryList) {
        if (err) {
            console.error(err);
            callback(err);
        } else {
            console.log("Load Defect History OK");
            callback(null, defectHistoryList);
        }
    });
};

exports.getLatest = function (callback) {
    DefectHistory.findOne({}, {}, {sort: {time: -1}}, function (err, defect) {
        callback(err, defect);
    });
};