'use strict'

var AlmController = require('./app/controllers/almClient.server.controller'),
    DefectController = require('./app/controllers/defect.server.controller'),
    UserController = require('./app/controllers/user.server.controller'),
    log = require('./app/util/util'),
    $http = require('http'),
    _=require('lodash');

function initUsers(req, res) {
    AlmController.getAllUsers(req, res);
    if(res){

        //console.log(res.data);
        /*var users = res.body.Users.User;
        _.each(users,function(id,value){
            console.log(value);
        });*/
    }
};

exports.InitDatabase = function (req, res) {
    initUsers(req, res);
    log.logger.info(res);
};