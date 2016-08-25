'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Alm = require('./almClient.server.controller'),
    _ = require('lodash');

/**
 * Create a user
 */
exports.create = function (req, res) {
    var query = {username: req.username};

    var isExist = User.count(query).exec();

    if (!isExist || isExist == 0) {
        var user = new User(req);
        user.save(function (err) {
            if (err) throw err;

            console.log('User saved successfully!');
        });
    }
    else {
        console.log('User already exist!');
    }

};

/**
 * Show the current user
 */
exports.read = function (req, res) {
    res.json(req.user);
};

/**
 * Update a user
 */
exports.update = function (req, res) {
    var user = req.user;

    user = _.extend(user, req.body);

    user.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(user);
        }
    });
};

/**
 * Delete an user
 */
exports.delete = function (req, res) {
    var user = req.user;

    user.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(user);
        }
    });
};

/**
 * List of Users
 */
exports.list = function (req, res) {
    User.find().exec(function (err, users) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(users);
        }
    });
};

/**
 * User middleware
 */
exports.userByID = function (req, res, next, id) {

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'User is invalid'
        });
    }

    User.findById(id).populate('user', 'displayName').exec(function (err, user) {
        if (err) return next(err);
        if (!user) {
            return res.status(404).send({
                message: 'User not found'
            });
        }
        req.user = user;
        next();
    });
};
