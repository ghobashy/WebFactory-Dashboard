var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name: {
        type: String
    },
    techLead: {
        type: [String]
    },
    pm: {
        type: [String]
    }
});

mongoose.model('Team', TeamSchema);