var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);


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
            skill: Joi.objectId()
        }
    },

    deleteSkill: {
        params: {
            skill: Joi.objectId()
        }
    }

};
