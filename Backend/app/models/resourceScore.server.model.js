var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ResourceScoreSchema = new Schema({
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resources'
    },
    technology: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skills'
    },
    score: {
        type: Number
    }
});

mongoose.model('ResourceScores', ResourceScoreSchema);