/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('TrafficChartCtrl', ['$scope', 'baConfig', 'colorHelper', 'almService', TrafficChartCtrl]);

    /** @ngInject */
    function TrafficChartCtrl($scope, baConfig, colorHelper, almService) {
        $scope.totalDefectsNumber = 0;
        $scope.totalOpenDefects = 0;
        var trafficChartValues = [];

        almService.subscribe($scope, function() {
            console.log("reload traffic charts");
            loadPieChartData();
        });
        loadPieChartData();

        var ctx = document.getElementById('chart-area').getContext('2d');
        window.myDoughnut = new Chart(ctx).Doughnut($scope.doughnutData, {
            segmentShowStroke: false,
            percentageInnerCutout: 64,
            responsive: true
        });

        function loadPieChartData() {
            var defects = almService.loadDefects();

            $scope.totalDefectsNumber = defects.length;

            var criticalCount = defects.filter(function (obj) {
                return ["1- critical"].indexOf(obj["severity"].toLowerCase()) > -1 && ["open", "reopen", "new"].indexOf(obj["status"].toLowerCase()) > -1;
            });
            var severeCount = defects.filter(function (obj) {
                return ["2- severe"].indexOf(obj["severity"].toLowerCase()) > -1 && ["open", "reopen", "new"].indexOf(obj["status"].toLowerCase()) > -1;
            });
            var majorCount = defects.filter(function (obj) {
                return ["3- major"].indexOf(obj["severity"].toLowerCase()) > -1 && ["open", "reopen", "new"].indexOf(obj["status"].toLowerCase()) > -1;
            });

            var minorCount = defects.filter(function (obj) {
                return ["4- minor"].indexOf(obj["severity"].toLowerCase()) > -1 && ["open", "reopen", "new"].indexOf(obj["status"].toLowerCase()) > -1;
            });
            $scope.totalOpenDefects = criticalCount.length +
                severeCount.length +
                majorCount.length +
                minorCount.length;


            trafficChartValues = [criticalCount.length,
                severeCount.length,
                majorCount.length,
                minorCount.length];

            $scope.transparent = baConfig.theme.blur;
            var dashboardColors = baConfig.colors.dashboard;
            $scope.doughnutData = [
                {
                    value: trafficChartValues[0],
                    color: dashboardColors.white,
                    highlight: colorHelper.shade(dashboardColors.white, 15),
                    label: 'Critical Defects',
                    percentage: (trafficChartValues[0] / $scope.totalOpenDefects) * 100,
                    order: 0
                }, {
                    value: trafficChartValues[1],
                    color: dashboardColors.blueStone,
                    highlight: colorHelper.shade(dashboardColors.blueStone, 15),
                    label: 'Severe Defects',
                    percentage: (trafficChartValues[1] / $scope.totalOpenDefects) * 100,
                    order: 1
                }, {
                    value: trafficChartValues[2],
                    color: dashboardColors.surfieGreen,
                    highlight: colorHelper.shade(dashboardColors.surfieGreen, 15),
                    label: 'Major Defects',
                    percentage: (trafficChartValues[2] / $scope.totalOpenDefects) * 100,
                    order: 2
                }, {
                    value: trafficChartValues[3],
                    color: dashboardColors.silverTree,
                    highlight: colorHelper.shade(dashboardColors.silverTree, 15),
                    label: 'Minor Defects',
                    percentage: (trafficChartValues[3] / $scope.totalOpenDefects) * 100,
                    order: 3
                }
            ];
        }
    }
})();