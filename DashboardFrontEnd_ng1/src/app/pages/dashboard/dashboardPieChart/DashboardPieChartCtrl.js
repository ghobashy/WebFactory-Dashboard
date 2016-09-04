/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardPieChartCtrl', ['$scope', '$timeout', 'baConfig', 'baUtil', 'almService', DashboardPieChartCtrl]);

    /** @ngInject */
    function DashboardPieChartCtrl($scope, $timeout, baConfig, baUtil, almService) {
        var pieColor = baUtil.hexToRGB(baConfig.colors.defaultText, 0.2);

        var totalDefectsNumber = 0;
        var pieChartValues = [];

        almService.subscribe($scope, function () {
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
            $('.chart').each(function () {
                var chart = $(this);
                chart.easyPieChart({
                    easing: 'easeOutBounce',
                    onStep: function (from, to, percent) {
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

            $('.refresh-data').on('click', function () {
                updatePieCharts();
            });
        }

        function updatePieCharts() {
            $('.pie-charts .chart').each(function (index, chart) {
                $(chart).data('easyPieChart').update((pieChartValues[index] / totalDefectsNumber) * 100);
            });
        }

        $timeout(function () {
            loadPieCharts();
            updatePieCharts();
        }, 1000);

        function loadPieChartData() {
            var defects = almService.loadDefects();

            totalDefectsNumber = defects.length;
            var fixedCount = defects.filter(function (obj) {
                return ["fixed"].indexOf(obj["status"].toLowerCase()) > -1;
            });
            var noticedCount = defects.filter(function (obj) {
                return obj["status"].toLowerCase() == "noticed";
            });
            var openCount = defects.filter(function (obj) {
                return ["open", "new"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            var closedCount = defects.filter(function (obj) {
                return ["closed"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            var rejectedCount = defects.filter(function (obj) {
                return ["rejected"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            var reOpenCount = defects.filter(function (obj) {
                return ["reopen"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            var retestBlockedCount = defects.filter(function (obj) {
                return ["retest blocked"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            var readyToRetestCount = defects.filter(function (obj) {
                return ["ready to retest"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            pieChartValues = [fixedCount.length,
                readyToRetestCount.length,
                noticedCount.length,
                openCount.length,
                closedCount.length,
                rejectedCount.length,
                reOpenCount.length,
                retestBlockedCount.length,

            ];

            $scope.charts = [{
                color: pieColor,
                description: 'Fixed',
                stats: numberWithCommas(fixedCount.length),
                icon: 'bug'
            },
                {
                    color: pieColor,
                    description: 'Ready to Retest',
                    stats: numberWithCommas(readyToRetestCount.length),
                    icon: 'bug'
                }, {
                color: pieColor,
                description: 'Noticed',
                stats: numberWithCommas(noticedCount.length),
                icon: 'bug'
            }, {
                color: pieColor,
                description: 'Open',
                stats: numberWithCommas(openCount.length),
                icon: 'bug'
            }, {
                color: pieColor,
                description: 'Closed',
                stats: numberWithCommas(closedCount.length),
                icon: 'bug'
            },
                {
                    color: pieColor,
                    description: 'Rejected',
                    stats: numberWithCommas(rejectedCount.length),
                    icon: 'bug'
                },
                {
                    color: pieColor,
                    description: 'Re-Open',
                    stats: numberWithCommas(reOpenCount.length),
                    icon: 'bug'
                },
                {
                    color: pieColor,
                    description: 'Retest Blocked',
                    stats: numberWithCommas(retestBlockedCount.length),
                    icon: 'bug'
                }
            ];
            $timeout(function () {
                loadPieCharts();
                updatePieCharts();
            }, 1000);
        }
    }
})();