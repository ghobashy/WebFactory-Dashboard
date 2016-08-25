var winston = require('winston');
var _ = require('lodash');


exports.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'filelog-info.log'
        })
    ]
});
