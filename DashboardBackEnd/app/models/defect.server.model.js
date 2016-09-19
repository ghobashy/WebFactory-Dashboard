var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DefectSchema = new Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    severity: {
        type: String
    },
    priority: {
        type: String
    },
    status: {
        type: String
    },
    owner: {
        type: String
    },
    detectedBy: {
        type: String
    },
    pageName: {
        type: String
    },
    environment: {
        type: String
    },
    defectType: {
        type: String
    },
    creationTime: {
        type: Date
    },
    lastModified: {
        type: Date
    },
});

mongoose.model('Defect', DefectSchema);