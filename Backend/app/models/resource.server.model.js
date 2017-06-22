var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResourceSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    team: {
        type: [String]
    },
    birthday: {
        type: Date
    },
    jobTitle: {
        type: String
    },
    avatar: {
        type: String
    },
    joinDate: {
        type: Date
    },
    mobileNumber: {
        type: String
    },
    level: {
        type: String
    }
});
mongoose.model('Resources', ResourceSchema);