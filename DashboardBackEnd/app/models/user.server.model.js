var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
    fullName: {
        type: String
    },
    username: {
        type: String
    },
    email: {
        type: String
    },
    phone: {
        type: String
    },
    team: {
        type: String
    }
});

mongoose.model('User', UserSchema);

