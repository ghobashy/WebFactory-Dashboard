/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard', [])
        .config(routeConfig)
        .controller('DashboardCtrl', ['$scope', '$interval', 'almService', DashboardCtrl]);

    function DashboardCtrl($scope, $interval, almService) {
        $scope.lineChartFilter = {
            showFixed: true,
            showReadyToRetest: true,
            showOpen: true,
            showNew: true,
            showClosed: true,
            showRejected: true,
            showReOpen: true
        };
        $scope.series = [];

        var stop = $interval(function() {
            console.log("Run Database update", new Date());
            almService.updateDatabase().then(function(result) {
                if (result > 0) {
                    console.log("found updates");
                    almService.notify();
                }
            });
        }, 600000);

        $scope.LoadLineChart = function() {
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
                $scope.periodDates.push(new Date(first.getFullYear(), first.getMonth(), first.getDate()));
                first = new Date(first.setDate(first.getDate() + 1));
            }

            $scope.data = [];
            $scope.series = [];
            if ($scope.lineChartFilter.showFixed) {
                $scope.series.push("Fixed");
                $scope.data.push(getHistoryCount('fixed', periodHistory, $scope.periodDates));
            }
            if ($scope.lineChartFilter.showReadyToRetest) {
                $scope.series.push("Ready to Retest");
                $scope.data.push(getHistoryCount('ready to retest', periodHistory, $scope.periodDates));
            }
            if ($scope.lineChartFilter.showOpen) {
                $scope.series.push("Open");
                $scope.data.push(getHistoryCount('open', periodHistory, $scope.periodDates));
            }
            if ($scope.lineChartFilter.showNew) {
                $scope.series.push("New");
                $scope.data.push(getHistoryCount('new', periodHistory, $scope.periodDates));
            }
            if ($scope.lineChartFilter.showClosed) {
                $scope.series.push("Closed");
                $scope.data.push(getHistoryCount('closed', periodHistory, $scope.periodDates));
            }
            if ($scope.lineChartFilter.showRejected) {
                $scope.series.push("Rejected");
                $scope.data.push(getHistoryCount('rejected', periodHistory, $scope.periodDates));
            }
            if ($scope.lineChartFilter.showReOpen) {
                $scope.series.push("ReOpened");
                $scope.data.push(getHistoryCount('reopen', periodHistory, $scope.periodDates));
            }
        };

        almService.subscribe($scope, function() {
            console.log("Load line chart");
            $scope.LoadLineChart();
        });
        $scope.LoadLineChart();

        function getHistoryCount(status, periodHistory, dates) {
            var historyList = [];
            for (var i = 0; i < dates.length; i++) {

                var history = periodHistory.filter(function(obj) {
                    return obj["property"].toLowerCase() == "status" &&
                        obj["newValue"].toLowerCase() == status &&
                        new Date(obj["time"]) >= dates[i] &&
                        new Date(obj["time"]) < new Date(dates[i].getFullYear(), dates[i].getMonth(), (dates[i].getDate() + 1));
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
                        function(almService) {
                            var curr = new Date;
                            var first = curr.getDate() - 6;
                            var last = curr + 1;

                            var firstday = new Date(curr.setDate(first));
                            var firstDayString = firstday.getFullYear() + "-" + (firstday.getMonth() + 1) + "-" + firstday.getDate();
                            var lastday = new Date(last);
                            var lastdayString = lastday.getFullYear() + "-" + (lastday.getMonth() + 1) + "-" + (lastday.getDate() + 1);
                            almService.getAllDefects();
                            almService.getPeriodProgress(firstDayString, lastdayString);
                            return;
                        }
                    ]
                }
            });
    }

})();