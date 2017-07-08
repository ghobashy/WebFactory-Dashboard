var Joi = require('joi');


module.exports = {

    createSkill: {
        body: {
            technology: Joi.string().required(),
            intermediateScore: Joi.number().required(),
            seniorScore: Joi.number().required(),
            leadScore: Joi.number().required(),
            group: Joi.string().required()
        }
    },

    updateSkill: {
        body: {
            technology: Joi.string(),
            intermediateScore: Joi.number(),
            seniorScore: Joi.number(),
            leadScore: Joi.number(),
            group: Joi.string()
        },
        params: {
            skill: Joi.string().hex()
        }
    }

};
