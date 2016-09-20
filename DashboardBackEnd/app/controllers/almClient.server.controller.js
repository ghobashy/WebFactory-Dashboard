'use strict';

var config = require('../../config/config.js'),
    _ = require('lodash'),
    https = require('https'),
    http = require('http'),
    chalk = require('chalk'),
    qcApi = require("../../app/controllers/qcApi.js").create(),
    DefectController = require('../../app/controllers/defect.server.controller'),
    DefectHistoryController = require('../../app/controllers/defectHistory.server.controller'),
    UserController = require('../../app/controllers/user.server.controller');

function Login() {
    return qcApi.login({
        "server": config.appSettings.alm.almUrl,
        "domain": config.appSettings.alm.Domain,
        "project": config.appSettings.alm.Project,
        "user": "eg_melzouhery",
        "password": "P@ssw0rd"
    });
};

exports.updatedDatabase = function(req, res) {
    updateDefects(res);
};
exports.getAllDefects = function(req, res) {
    DefectController.list({}, function(err, defects) {
        if (err) {
            res.send(err);
        } else {
            res.send(defects);
        }
    });

};
exports.getDefect = function(req, res) {

    DefectController.get(req.params.id, function(err, defect) {
        if (err) {
            res.send(err);
        } else {
            res.send(defect);
        }
    });
};
exports.getDefectHistory = function(req, res) {
    DefectHistoryController.get(req.params.id, function(err, defectHistory) {
        if (err) {
            res.send(err);
        } else {
            res.send(defectHistory);
        }
    });
};
exports.getUsersDefects = function(req, res) {
    var userList = req.params.users.split(',');
    var conditionList = [];
    _.each(userList, function(obj) {
        conditionList.push(new RegExp(obj, "i"));
    });

    DefectController.list({
        'owner': { $in: conditionList }
    }, function(err, defect) {
        if (err) {
            res.send(err);
        } else {
            res.send(defect);
        }
    });
};
exports.getStatusDefects = function(req, res) {
    var statusList = req.params.status.split(',');
    var conditionList = [];
    _.each(statusList, function(obj) {
        conditionList.push(new RegExp(obj, "i"));
    });

    DefectController.list({
        'status': { $in: conditionList }
    }, function(err, defect) {
        if (err) {
            res.send(err);
        } else {
            res.send(defect);
        }
    });
};
exports.getAllUsers = function(req, res) {
    var defectsURL = config.appSettings.alm.EntityCollection.replace("{Entity Type}", "customization/user");

    Login().then(
        function() {
            qcApi.get(defectsURL)
                .then(function(output) {
                    console.log("got users");
                    _.each(output.Users.User, function(obj, id) {
                        UserController.create({
                            fullName: obj.$.FullName,
                            username: obj.$.Name,
                            email: obj.email[0],
                            phone: obj.phone[0],
                            team: ""
                        });
                    });
                    res.send(output);
                }, function(err) {
                    console.log("error occured: %s", err);
                    res.send("error occured: %s", err);
                });
        },
        function(err) {
            console.log("error occured: %s", err);
            res.send("error occured: %s", err);
        });
};
exports.getPeriodHistory = function(req, res) {
    var startDate = req.params.startDate;
    var endDate = req.params.endDate;
    DefectHistoryController.list({ time: { "$gte": new Date(startDate), "$lt": new Date(endDate) } }, function(err, defectHistory) {
        if (err) {
            res.send(err);
        } else {
            res.send(defectHistory);
        }
    });
};


function updateDefects(res) {
    DefectController.getLatest(function(err, defect) {
        if (err) {
            res.send(err);
        } else {
            Login().then(
                function() {
                    if (defect) {
                        var lastModDateTime = defect.lastModified.getFullYear() +
                            "-" + (parseInt(defect.lastModified.getMonth()) + 1) +
                            "-" + defect.lastModified.getDate() + " " +
                            defect.lastModified.getHours() + ":" +
                            defect.lastModified.getMinutes() + ":" +
                            defect.lastModified.getSeconds();

                        var lastModDate = defect.lastModified.getFullYear() +
                            "-" + (parseInt(defect.lastModified.getMonth()) + 1) +
                            "-" + defect.lastModified.getDate();

                        var defectsURL = config.appSettings.alm.EntityCollection.replace("{Entity Type}", "defect") + "?query={ last-modified[>'" + lastModDateTime + "']}";
                        getDefects(defectsURL);
                    } else {
                        var defectsURL = config.appSettings.alm.EntityCollection.replace("{Entity Type}", "defect");
                        getDefects(defectsURL);
                    }
                    res.send("In Progress");
                },
                function(err) {
                    console.log("error occured: %s", JSON.stringify(err));
                    res.send("error occured: %s", JSON.stringify(err));
                });
        }
    });
}

function getALMHistory(lastModDate, defectRange = ">0") {

    var defectURL = config.appSettings.alm.EntityCollection.replace("{Entity Type}", "audit") + "?query={parent-type[defect];parent-id[" + defectRange + "]%TIME%}";
    if (lastModDate) {
        defectURL = defectURL.replace("%TIME%", ";Time[>" + lastModDate + "]");
    } else {
        defectURL = defectURL.replace("%TIME%", "");
    }
    console.log("Get Defect History");
    Login().then(
        function() {
            qcApi.get(defectURL, {
                    pageSize: 'max'
                })
                .then(function(defect) {
                    console.log("got  defect history ", defect.Audits.Audit.length);
                    _.each(defect.Audits.Audit, function(obj, id) {
                        if (obj.Properties.length > 0 && obj.Properties[0].Property) {
                            _.each(obj.Properties[0].Property, function(prop, propId) {
                                var history = {
                                    Id: obj.Id[0],
                                    defectId: obj.ParentId[0],
                                    username: obj.User[0],
                                    time: obj.Time[0],
                                    oldValue: prop.OldValue[0],
                                    newValue: prop.NewValue[0],
                                    property: prop.$.Name
                                };
                                DefectHistoryController.create(history);
                            });
                        }

                    });
                }, function(err) {
                    console.log("error occured: %s", JSON.stringify(err));
                });
        },
        function(err) {
            console.log("error occured: %s", JSON.stringify(err));
        });
}

function getDefects(defectsURL) {
    qcApi.get(defectsURL, {
            pageSize: 'max',
            fields: config.appSettings.fields
        })
        .then(function(defects) {
            console.log("got $s defects", defects.length);
            var defectList = [];
            _.each(defects, function(obj, id) {
                DefectController.create({
                    id: parseInt(obj.id),
                    name: obj.name,
                    severity: obj.severity,
                    priority: obj.priority,
                    status: obj.status,
                    owner: obj.owner,
                    detectedBy: obj["detected-by"],
                    pageName: obj["user-13"],
                    environment: obj["user-05"],
                    defectType: obj["user-04"],
                    creationTime: obj["creation-time"],
                    lastModified: obj["last-modified"]
                }, function(err) {
                    if (err) {
                        console.log(JSON.stringify(err));
                    }
                });

                defectList.push(obj.id);
                if (defectList.length == 200 || id == defects.length - 1) {
                    var defectRange = defectList.join(" Or ");
                    getALMHistory(null, defectRange);
                    defectList = [];
                }
            });
        }, function(err) {
            console.log("error occured: %s", JSON.stringify(err));
        });
}