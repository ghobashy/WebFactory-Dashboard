/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function() {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardPieChartCtrl', ['$scope', '$timeout', 'baConfig', 'baUtil', 'almService', '$uibModal', DashboardPieChartCtrl]);

    /** @ngInject */
    function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil, almService, $uibModal) {
        $scope.modalTitle = "TEST";
        $scope.smartTablePageSize = 5;
        var fixedCount = [],
            readyToRetestCount = [],
            noticedCount = [],
            openCount = [],
            closedCount = [],
            rejectedCount = [],
            reOpenCount = [],
            retestBlockedCount = [];
        $scope.defectList = [];

        var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);
        var totalDefectsNumber = 0;
        var pieChartValues = [];

        almService.subscribe($scope, function() {
            console.log("reload pie charts");
            loadPieChartData();
        });

        loadPieChartData();

        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

        function getRandomArbitrary(min, max) {
            return Math.random() * (max - min) + min;
        }

        function loadPieCharts() {
            $('.chart').each(function() {
                var chart = $(this);
                chart.easyPieChart({
                    easing: 'easeOutBounce',
                    onStep: function(from, to, percent) {
                        $(this.el).find('.percent').text(Math.round(percent));
                    },
                    barColor: chart.attr('rel'),
                    trackColor: 'rgba(0,0,0,0)',
                    size: 84,
                    scaleLength: 0,
                    animation: 2000,
                    lineWidth: 9,
                    lineCap: 'round',
                });
            });

            $('.refresh-data').on('click', function() {
                updatePieCharts();
            });
        }

        function updatePieCharts() {
            $('.pie-charts .chart').each(function(index, chart) {
                $(chart).data('easyPieChart').update((pieChartValues[index] / totalDefectsNumber) * 100);
            });
        }

        $timeout(function() {
            loadPieCharts();
            updatePieCharts();
        }, 1000);

        function loadPieChartData() {
            var defects = almService.loadDefects();

            totalDefectsNumber = defects.length;
            fixedCount = defects.filter(function(obj) {
                return ["fixed"].indexOf(obj["status"].toLowerCase()) > -1;
            });
            noticedCount = defects.filter(function(obj) {
                return obj["status"].toLowerCase() == "noticed";
            });
            openCount = defects.filter(function(obj) {
                return ["open", "new"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            closedCount = defects.filter(function(obj) {
                return ["closed"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            rejectedCount = defects.filter(function(obj) {
                return ["rejected"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            reOpenCount = defects.filter(function(obj) {
                return ["reopen"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            retestBlockedCount = defects.filter(function(obj) {
                return ["retest blocked"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            readyToRetestCount = defects.filter(function(obj) {
                return ["ready to retest"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            pieChartValues = [fixedCount.length,
                readyToRetestCount.length,
                noticedCount.length,
                openCount.length,
                closedCount.length,
                rejectedCount.length,
                reOpenCount.length,
                retestBlockedCount.length
            ];

            $scope.charts = [{
                    name: "fixed",
                    color: pieColor,
                    description: 'Fixed',
                    stats: numberWithCommas(fixedCount.length),
                    icon: 'bug'
                },
                {
                    name: "readyToRetest",
                    color: pieColor,
                    description: 'Ready to Retest',
                    stats: numberWithCommas(readyToRetestCount.length),
                    icon: 'bug'
                }, {
                    name: "noticed",
                    color: pieColor,
                    description: 'Noticed',
                    stats: numberWithCommas(noticedCount.length),
                    icon: 'bug'
                }, {
                    name: "open",
                    color: pieColor,
                    description: 'Open',
                    stats: numberWithCommas(openCount.length),
                    icon: 'bug'
                }, {
                    name: "closed",
                    color: pieColor,
                    description: 'Closed',
                    stats: numberWithCommas(closedCount.length),
                    icon: 'bug'
                },
                {
                    name: "rejected",
                    color: pieColor,
                    description: 'Rejected',
                    stats: numberWithCommas(rejectedCount.length),
                    icon: 'bug'
                },
                {
                    name: "reOpen",
                    color: pieColor,
                    description: 'Re-Open',
                    stats: numberWithCommas(reOpenCount.length),
                    icon: 'bug'
                },
                {
                    name: "retestBlocked",
                    color: pieColor,
                    description: 'Retest Blocked',
                    stats: numberWithCommas(retestBlockedCount.length),
                    icon: 'bug'
                }
            ];
            $timeout(function() {
                loadPieCharts();
                updatePieCharts();
            }, 1000);
        }

        $scope.open = function(status) {
            $scope.modalTitle = "";
            $scope.defectList = [];
            switch (status) {
                case "fixed":
                    $scope.modalTitle = "Fixed Defects";
                    $scope.defectList = fixedCount;
                    break;
                case "readyToRetest":
                    $scope.modalTitle = "Ready to retest Defects";
                    $scope.defectList = readyToRetestCount;
                    break;
                case "noticed":
                    $scope.modalTitle = "Noticed Defects";
                    $scope.defectList = noticedCount;
                    break;
                case "open":
                    $scope.modalTitle = "Open Defects";
                    $scope.defectList = openCount;
                    break;
                case "closed":
                    $scope.modalTitle = "Closed Defects";
                    $scope.defectList = closedCount;
                    break;
                case "rejected":
                    $scope.modalTitle = "Rejected Defects";
                    $scope.defectList = rejectedCount;
                    break;
                case "reOpen":
                    $scope.modalTitle = "Re-Open Defects";
                    $scope.defectList = reOpenCount;
                    break;
                case "retestBlocked":
                    $scope.modalTitle = "Retest blocked Defects";
                    $scope.defectList = retestBlockedCount;
                    break;
            }

            $uibModal.open({
                animation: true,
                templateUrl: "app/pages/dashboard/templates/largeModal.html",
                size: "lg",
                scope: $scope
            });

        }
    }
})();