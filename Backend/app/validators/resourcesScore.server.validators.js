var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

module.exports = {

    createScore: {
        body: {
            resource: Joi.objectId(),
            technology: Joi.objectId(),
            score: Joi.number().required()
        }
    },

    updateScore: {
        body: {
            resource: Joi.objectId(),
            technology: Joi.objectId(),
            score: Joi.number().required()
        },
        params: {
            score: Joi.objectId()
        }
    },

    deleteScore: {
        params: {
            score: Joi.objectId()
        }
    }

};
