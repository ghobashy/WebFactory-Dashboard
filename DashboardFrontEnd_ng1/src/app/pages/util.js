(function () {
    'use strict';

    angular.module('BlurAdmin.pages')
        .factory('util', [util]);

    /** @ngInject */
    function util() {

        return {
            replacePlaceHolders: replacePlaceHolders,
            dateToString: dateToString
        };

        function replacePlaceHolders(str, data) {
            var output = str.replace(/%[^%]+%/g, function (match) {
                if (match in data) {
                    return (data[match]);
                } else {
                    return ("");
                }
            });
            return (output);
        }

        function dateToString(date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        }
    }
})();
