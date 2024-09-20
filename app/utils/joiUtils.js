/* eslint-disable no-unused-expressions */
/* eslint-disable no-shadow */

'use strict';

const Joi = require('joi');

const joiUtils = {};

joiUtils.Joi = Joi.extend((Joi) => ({
  type: 'date',
  base: Joi.date(),
  messages: {
    'date.dateOnly': '{{#label}} must contain only date.',
  },
  rules: {
    dateOnly: {
      validate(value, helpers) {
        if (new Date(value)) {
          const timestamp = (new Date(value || new Date())).setHours(0, 0, 0, 0);
          return new Date(timestamp);
        }
        return helpers.error('date.dateOnly');
      },
    },
  },
}));

/** functions for files in multipart/form-data * */
joiUtils.Joi.file = ({ name, description = 'File' }) => (
  { [name]: Joi.any().meta({ swaggerType: 'file' }).optional().description(description) }
);

joiUtils.Joi.fileArray = ({ name, description = 'File', maxCount }) => {
  const joiValidation = Joi.any().meta({ swaggerType: 'file' }).optional().description(description);
  maxCount && (joiValidation.maxCount = maxCount);
  return { [name]: joiValidation };
};

joiUtils.Joi.files = ({ maxCount, description = 'File' }) => {
  const joiValidation = Joi.any().meta({ swaggerType: 'file' }).optional().description(description);
  joiValidation.maxCount = maxCount;
  return joiValidation;
};

module.exports = joiUtils;
