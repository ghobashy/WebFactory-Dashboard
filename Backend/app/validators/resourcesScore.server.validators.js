var Joi = require('joi');


module.exports = {

    createScore: {
        body: {
            resource: Joi.string().hex().required(),
            technology: Joi.string().hex().required(),
            score: Joi.number().required()
        }
    },

    updateScore: {
        body: {
            resource: Joi.string().hex().required(),
            technology: Joi.string().hex().required(),
            score: Joi.number().required()
        },
        params: {
            score: Joi.string().hex()
        }
    }

};
