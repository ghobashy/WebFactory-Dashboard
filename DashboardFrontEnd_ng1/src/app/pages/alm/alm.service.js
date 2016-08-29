(function () {
    'use strict';

    angular.module('BlurAdmin.pages')
        .factory('almService', ['$http', 'config', '$rootScope','util', almService]);

    /** @ngInject */
    function almService($http, config, $rootScope, util) {
        var allDefects = [];
        var weekHistory = [];
        return {
            loadDefects: loadDefects,
            loadDefectHistory: loadDefectHistory,
            getAllDefects: getAllDefects,
            getPeriodProgress: getPeriodProgress,
            updateDatabase: updateDatabase,
            subscribe: function (scope, callback) {
                var handler = $rootScope.$on('new-defect-notifying', callback);
                scope.$on('$destroy', handler);
            },
            notify: function () {
                $rootScope.$emit('new-defect-notifying');
            }
        };
        function loadDefects() {
            return allDefects;
        }
        function loadDefectHistory(){
            return weekHistory;
        }
        function getAllDefects() {
            return $http.get(config.almApiURLs.GET_ALL_DEFECTS).then(function (res) {
                if (typeof res.data === 'object' && res.data !== {} && res.data.length > 0) {
                    allDefects = res.data;
                    return res.data;
                }
                return null;
            }, function (err) {
                console.log(err);
            });
        }
        function updateDatabase() {
            return $http.get(config.almApiURLs.UPDATE_DATABASE).then(function (res) {
                if (typeof res.data === 'object' && res.data !== {} && res.data.length > 0) {
                    getAllDefects();
                    return res.data.length;
                } else {
                    return 0;
                }
            }, function (err) {
                console.log(err);
            });
        }
        function getPeriodProgress(startDate,endDate){
            var url = util.replacePlaceHolders(config.almApiURLs.GET_PERIOD_HISTORY, {
                "%STARTDATE%": startDate,
                "%ENDDATE%": endDate
            });
            return $http.get(url).then(function (res) {
                if (typeof res.data === 'object' && res.data !== {} && res.data.length > 0) {
                    weekHistory = res.data;
                    return res.data;
                }
                return null;
            }, function (err) {
                console.log(err);
            });
        }
    }
})();