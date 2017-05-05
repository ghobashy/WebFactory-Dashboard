var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var JiraItemSchema = new Schema({
    key: {
        type: String
    },
    summary: {
        type: String
    },
    status: {
        type: String
    },
    priority: {
        type: String
    },
    severity: { //customfield_10212
        type: String
    },
    affecting: { //customfield_18284
        type: String
    },
    issuetype: {
        type: String
    },
    // components: {
    //     type: String
    // },
    storyPoints: { //customfield_10212
        type: Number
    },
    created: {
        type: Date
    },
    updated: {
        type: Date
    },
    userAssigned: {
        type: String
    }

});

mongoose.model('JiraItem', JiraItemSchema);

/*
{
        author: String,
        created: Date,
        field: String,
        fromValue: String,
        toValue: String
    } */