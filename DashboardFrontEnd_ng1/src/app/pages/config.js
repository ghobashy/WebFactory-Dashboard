(function () {
    'use strict';

    var alm = angular.module('BlurAdmin.pages');

    var API_BASE_URL = "http://localhost:3000";

    var config = {

        almApiURLs: {
            GET_ALL_DEFECTS: API_BASE_URL + '/alm/all',
            UPDATE_DATABASE: API_BASE_URL + '/alm/update',
            GET_DEFECT: API_BASE_URL + '/alm/%ID%',
            GET_ALL_USERS: API_BASE_URL + '/alm/users/all',
            GET_DEFECT_HISTORY: API_BASE_URL + '/alm/history/%ID%',
            GET_USERS_DEFECTS: API_BASE_URL + '/alm/users/%USERS%',
            GET_STATUS_DEFECTS: API_BASE_URL + '/alm/status/%STATUS%'
        }
    };
    alm.value('config', config);
})();
