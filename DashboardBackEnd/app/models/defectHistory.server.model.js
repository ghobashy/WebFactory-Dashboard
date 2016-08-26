var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DefectHistorySchema = new Schema({
    Id: {
        type: Number
    },
    defectId: {
        type: Number
    },
    username: {
        type: String
    },
    time: {
        type: Date
    },
    oldValue: {
        type: String
    },
    newValue: {
        type: String
    }
});

mongoose.model('DefectHistory', DefectHistorySchema);


