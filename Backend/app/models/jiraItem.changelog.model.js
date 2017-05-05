var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JiraItemChangeLogSchema = new Schema({
    id: {
        type: String
    },
    key: {
        type: String
    },
    author: { type: String },
    created: { type: Date },
    field: { type: String },
    fromValue: { type: String },
    toValue: { type: String }
});

mongoose.model('JiraItemChangeLog', JiraItemChangeLogSchema);