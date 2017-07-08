/**
 * Module dependencies.
 */
var mongoose = require('mongoose'), Skill = mongoose.model('Skills');


exports.list = function (req, res) {

    const query = Skill.find();

    console.log(req.query);

    if (req.query.technology) {
        query.where('technology', req.query.technology);
    }

    if (req.query.group) {
        query.where('group', req.query.group);
    }

    query.exec((err, skillList) => {

        if (err) {

            console.error(err);
        } else {

            console.log("Load Skills OK");

            res.json(skillList);
        }
    });
};

exports.create = function (req, res) {

    var newSkill = Skill({
        technology: req.body.technology,
        group: req.body.group,
        intermediateScore: req.body.intermediateScore,
        seniorScore: req.body.seniorScore,
        leadScore: req.body.leadScore
    });

    newSkill.save(function (err, newSkill) {

        if (err) {

            console.error(err);
        } else {

            console.log("new skill is added");
            res.json(newSkill);
        }
    });
};

exports.update = function (req, res) {

    Skill.findOneAndUpdate({ _id: new mongoose.mongo.ObjectId(req.params.skill) },
        { $set: req.body }, { new: true }).exec((err, updatedSkill) => {

            if (err) {

                console.error(err);
            } else {

                console.log("skill is up to date");
                res.json(updatedSkill);
            }
        });
};

exports.remove = function (req, res) {

    Skill.findOneAndRemove({ _id: new mongoose.mongo.ObjectId(req.params.skill) }).exec(function (err, removedSkill) {

        if (err) {

            console.error(err);
        } else {

            console.log("skill is deleted");
            res.json(removedSkill);
        }
    });
};