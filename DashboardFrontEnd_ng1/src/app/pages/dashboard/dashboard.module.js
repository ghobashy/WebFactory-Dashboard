/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard', [])
        .config(routeConfig)
        .controller('DashboardCtrl', ['$scope', '$interval', 'almService', DashboardCtrl]);

    function DashboardCtrl($scope, $interval, almService) {
        var stop = $interval(function () {
            console.log("Run Database update", new Date());
            almService.updateDatabase().then(function (result) {
                if (result > 0) {
                    console.log("found updates");
                    almService.notify();
                }
            });
        }, 30000);

        var periodHistory = almService.loadDefectHistory();

        var first = new Date;
        first = new Date(first.setDate(first.getDate() - 6));
        var last = new Date;

        var weekday = new Array(7);
        weekday[0] = "Sunday";
        weekday[1] = "Monday";
        weekday[2] = "Tuesday";
        weekday[3] = "Wednesday";
        weekday[4] = "Thursday";
        weekday[5] = "Friday";
        weekday[6] = "Saturday";

        $scope.labels = [];
        $scope.periodDates = [];
        while (first <= last) {
            $scope.labels.push(weekday[first.getDay()]);
            $scope.periodDates.push(new Date(first.getFullYear(),first.getMonth(),first.getDate()));
            first = new Date(first.setDate(first.getDate() + 1));
        }

        $scope.data = [
            getHistoryCount('fixed',$scope.periodDates),
            getHistoryCount('ready to retest',$scope.periodDates),
            getHistoryCount('open',$scope.periodDates),
            getHistoryCount('new',$scope.periodDates),
            getHistoryCount('closed',$scope.periodDates),
            getHistoryCount('rejected',$scope.periodDates),
            getHistoryCount('reopen',$scope.periodDates),
        ];
        $scope.series = ['Fixed', 'Ready to Retest', 'Open', 'New', 'Closed', 'Rejected', 'ReOpened'];

        function getHistoryCount(status, dates) {
            var historyList = [];
            for (var i = 0; i < dates.length; i++) {

                var history = periodHistory.filter(function (obj) {
                    return obj["newValue"].toLowerCase() == status &&
                        new Date(obj["time"]) >= dates[i] &&
                        new Date(obj["time"]) < new Date(dates[i].getFullYear(),dates[i].getMonth(),(dates[i].getDate()+1));
                });
                historyList.push(history.length);
            }
            return historyList;
        }



       
    }


    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/pages/dashboard/dashboard.html',
                title: 'Dashboard',
                controller: 'DashboardCtrl',
                sidebarMeta: {
                    icon: 'ion-android-home',
                    order: 0
                },
                resolve: {
                    data: ['almService',
                        function (almService) {
                            var curr = new Date; // get current date
                            /*var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
                             var last = first + 6; // last day is the first day + 6*/
                            var first = curr.getDate() - 6;
                            var last = curr + 1;

                            var firstday = new Date(curr.setDate(first));
                            var firstDayString = firstday.getFullYear() + "-" + (firstday.getMonth() + 1) + "-" + firstday.getDate();
                            var lastday = new Date(last);
                            var lastdayString = lastday.getFullYear() + "-" + (lastday.getMonth() + 1) + "-" + lastday.getDate();
                            almService.getAllDefects();
                            almService.getPeriodProgress(firstDayString, lastdayString);
                            return;
                        }]
                }
            });
    }

})();
