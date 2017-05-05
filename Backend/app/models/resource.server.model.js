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
    }
});

mongoose.model('Resource', ResourceSchema);