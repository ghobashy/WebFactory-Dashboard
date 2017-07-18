/**
 * Module dependencies.
 */

var mongoose = require('mongoose'), ResourceScore = mongoose.model('ResourceScores');

exports.get = function (resourceId, callback) {
    ResourceScore.findOne({ resource: resourceId }, function (err, skillMatrix) {
        callback(err, skillMatrix);
    });
};

exports.list = (req, res) => {

    const query = ResourceScore.find();

    if (req.query.resource) {
        query.where('resource', req.query.resource);
    }

    if (req.query.technology) {
        query.where('technology', req.query.technology);
    }

    query.populate("resource").populate("technology").exec(function (err, skillMatrix) {

        if (err) {

            console.error(err);
        } else {

            console.log("Load skillMatrix OK");
            res.json(skillMatrix);
        }
    });

};

exports.create = (req, res) => {

    var resourceScore = new ResourceScore({
        technology: req.body.technology,
        resource: req.body.resource,
        score: req.body.score
    });

    resourceScore.save((err, newScore) => {

        if (err) {

            console.error(err);
        } else {

            console.log('Resource score saved successfully!');
            res.json(newScore);
        }
    });

};

exports.getResourcesForMaxScoreInTechnology = (req, res) => {

    if (req.query.level) {

        let technologyObjectId = new mongoose.mongo.ObjectId(req.params.technology);

        const query = ResourceScore.aggregate([
            {
                $lookup:
                {
                    from: 'resources',
                    localField: 'resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            {
                $match: { 'resource.level': req.query.level, 'technology': technologyObjectId }
            },
            { $sort: { score: -1 } }
        ]);

        query.exec((err, data) => {

            if (err) {
                console.error(err);
            }
            else {
                res.json(data);
            }
        });

    } else {

        ResourceScore.find({ technology: req.params.technology })
            .populate('resource')
            .sort('-score')
            .exec((err, skillMatrix) => {

                if (err) {
                    console.error(err);
                } else {

                    console.log("Load skillMatrix OK");
                    res.json(skillMatrix);
                }
            });
    }
};

exports.update = (record, callback) => {

    console.log("update Resource score id ", record.resource);

    Resource.update({ resource: record.resource, technology: req.technology }, {
        $set: {
            resource: record.resource,
            technology: record.technology,
            score: record.score
        }
    }, function (err, result) {
        console.log(result);
        callback(err, result);
    });
};

exports.remove = function (req, res) {

    ResourceScore.findOneAndRemove({ _id: new mongoose.mongo.ObjectId(req.params.score) }).exec(function (err, removedScore) {

        if (err) {

            console.error(err);
        } else {

            console.log("score is deleted");
            res.json(removedScore);
        }
    });
};