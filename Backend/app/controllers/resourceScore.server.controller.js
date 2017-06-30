/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    ResourceScore = mongoose.model('ResourceScores'),
    _ = require('lodash');

exports.get = function(resourceId, callback) {
    ResourceScore.findOne({ resource: resourceId }, function(err, skillMatrix) {
        callback(err, skillMatrix);
    });
};

exports.list = function(req, res) {
    console.log("==== Load ResourceScores ====");
    var filter = "";
    if (req.params.resource) {
        filter = { 'resource': req.params.resource };
        console.log(filter);
    }
    ResourceScore.find(filter).populate("resource").populate("technology").exec(function(err, skillMatrix) {
        if (err) {
            console.error(err);
            res.status(500).send(err);
        } else {
            console.log("Load ResourceScores OK");
            res.status(200).send(skillMatrix);
        }
    });
};

exports.create = function(req, callback) {
    ResourceScore.count({ resource: req.resource, technology: req.technology }, function(err, count) {
        if (err) {
            callback(err);
        }
        if (count === 0) {
            var resourceScore = new ResourceScore(req);
            resourceScore.save(function(err) {
                if (err) {
                    callback(err);
                } else {
                    console.log('Resource score saved successfully!');
                }
            });
        } else {
            update(req, callback);
        }
    });
};

function update(record, callback) {
    console.log("update Resource score id ", record.resource);
    Resource.update({ resource: record.resource, technology: req.technology }, {
        $set: {
            resource: record.resource,
            technology: record.technology,
            score: record.score
        }
    }, function(err, result) {
        console.log(result);
        callback(err, result);
    });
}