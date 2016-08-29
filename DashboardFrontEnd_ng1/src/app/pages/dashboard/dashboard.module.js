/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard', [])
        .config(routeConfig)
        .controller('DashboardCtrl', ['$scope','$interval', 'almService', DashboardCtrl]);

    function DashboardCtrl($scope,$interval, almService) {
        var stop = $interval(function () {
            console.log("Run Database update", new Date());
            almService.updateDatabase().then(function (result) {
                if (result > 0) {
                    console.log("found updates");
                    almService.notify();
                }
            });
        }, 10000);
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
                        return almService.getAllDefects();
                    }]
                }
            });
    }

})();
