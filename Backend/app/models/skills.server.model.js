var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SkillSchema = new Schema({
    technology: {
        type: String
    },
    intermediateScore: {
        type: Number
    },
    seniorScore: {
        type: Number
    },
    leadScore: {
        type: Number
    },
    group: {
        type: String
    }
});

mongoose.model('Skills', SkillSchema);