'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Defect = mongoose.model('Defect'),
    Alm = require('./almClient.server.controller'),
    _ = require('lodash');

/**
 * Create a defect
 */
exports.create = function (req, res) {
    var query = {id: req.id};

    var isExist = Defect.count(query).exec();

    if (!isExist || isExist == 0) {
        var defect = new Defect(req);

        defect.save(function (err) {
            if (err) throw err;
            console.log('defect saved successfully!');
        });
    }

};

/**
 * Show the current defect
 */
exports.read = function (req, res) {
    res.json(req.defect);
};

/**
 * Update a defect
 */
exports.update = function (req, res) {
    var defect = req.defect;

    defect = _.extend(defect, req.body);

    defect.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(defect);
        }
    });
};

/**
 * Delete an defect
 */
exports.delete = function (req, res) {
    var defect = req.defect;

    defect.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(defect);
        }
    });
};

/**
 * List of Defects
 */
exports.list = function (req, res) {
    Defect.find().sort('-created').populate('user', 'displayName').exec(function (err, defects) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(defects);
        }
    });
};

/**
 * Defect middleware
 */
exports.defectByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Defect is invalid'
        });
    }

    Defect.findById(id).populate('user', 'displayName').exec(function (err, defect) {
        if (err) return next(err);
        if (!defect) {
            return res.status(404).send({
                message: 'Defect not found'
            });
        }
        req.defect = defect;
        next();
    });
};
