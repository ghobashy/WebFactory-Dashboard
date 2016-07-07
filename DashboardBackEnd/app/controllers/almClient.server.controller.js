'use strict';

var config = require('../../config/config.js'),
    _ = require('lodash'),
    https = require('https'),
    http = require('http'),
    qcApi = require('qc.js').create();

function Login() {
    return qcApi.login({
        "server": config.appSettings.alm.almUrl,
        "domain": config.appSettings.alm.Domain,
        "project": config.appSettings.alm.Project,
        "user": "eg_melzouhery",
        "password": ""
    });
};

exports.getAllDefects = function (req, res) {
    var defectsURL = config.appSettings.alm.EntityCollection.replace("{Entity Type}", "defect");

    Login().then(
        function () {
            qcApi.get(defectsURL, {pageSize: 'max'})
                .then(function (defects) {
                    console.log("got $s defects", defects.length);
                    res.send(defects);
                }, function (err) {
                    console.log("error occured: %s", err);
                    res.send("error occured: %s", err);
                });
        }, function (err) {
            console.log("error occured: %s", err);
            res.send("error occured: %s", err);
        });
};

exports.getDefect = function (req, res) {
    var defectURL = config.appSettings.alm.Entity.replace("{Entity Type}", "defect").replace("{Entity ID}", req.params.id);
    Login().then(
        function () {
            qcApi.get(defectURL)
                .then(function (defect) {
                    console.log("got $s defects", defect.length);
                    res.send(defect);
                }, function (err) {
                    console.log("error occured: %s", err);
                    res.send("error occured: %s", err);
                });
        }, function (err) {
            console.log("error occured: %s", err);
            res.send("error occured: %s", err);
        });
};

exports.getDefectHistory = function (req, res) {
    var defectURL = config.appSettings.alm.EntityHistory.replace("{Entity Type}", "defect").replace("{Entity ID}", req.params.id);
    Login().then(
        function () {
            qcApi.get(defectURL)
                .then(function (defect) {
                    console.log("got $s defects", defect.length);
                    res.send(defect);
                }, function (err) {
                    console.log("error occured: %s", err);
                    res.send("error occured: %s", err);
                });
        }, function (err) {
            console.log("error occured: %s", err);
            res.send("error occured: %s", err);
        });
};

exports.getUsersDefects = function (req, res) {
    var defectsURL = config.appSettings.alm.EntityCollection.replace("{Entity Type}", "defect");

    Login().then(
        function () {
            console.log(req.params.users.split(',').join(' or '));
            qcApi.get(defectsURL+"?query={ owner[= " + req.params.users.split(',').join(' or ') + "]}", {pageSize: 'max'})
                .then(function (defects) {
                    console.log("got $s defects", defects.length);
                    res.send(defects);
                }, function (err) {
                    console.log("error occured: %s", err);
                    res.send("error occured: %s", err);
                });
        }, function (err) {
            console.log("error occured: %s", err);
            res.send("error occured: %s", err);
        });
};



exports.getStatusDefects = function (req, res) {
    var defectsURL = config.appSettings.alm.EntityCollection.replace("{Entity Type}", "defect");

    Login().then(
        function () {
            console.log(req.params.status.split(',').join(' or '));
            qcApi.get(defectsURL+"?query={ status[= " + req.params.status.split(',').join(' or ') + "]}", {pageSize: 'max'})
                .then(function (defects) {
                    console.log("got $s defects", defects.length);
                    res.send(defects);
                }, function (err) {
                    console.log("error occured: %s", err);
                    res.send("error occured: %s", err);
                });
        }, function (err) {
            console.log("error occured: %s", err);
            res.send("error occured: %s", err);
        });
};