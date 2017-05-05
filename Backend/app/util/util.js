var winston = require('winston');
var _ = require('lodash');


exports.logger = new(winston.Logger)({
    transports: [
        new(winston.transports.File)({
            name: 'info-file',
            filename: 'filelog-info.log'
        })
    ]
});
exports.getDateOrdinal = function(d) {
    if (d > 3 && d < 21) return 'th'; // thanks kennebec
    switch (d % 10) {
        case 1:
            return "st";
        case 2:
            return "nd";
        case 3:
            return "rd";
        default:
            return "th";
    }
}

exports.getMonthName = function(month) {
    var monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    return monthNames[month];
}

exports.getDayName = function(day) {
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[day];
}