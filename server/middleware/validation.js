// Validation file to double check user inputs
const Joi = require('@hapi/joi')

// Register Validation
exports.credential = function credentialValidation (data) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(3),
    email: Joi.string()
      .required()
      .email(),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9-@/+*!%&.]*$'))
  })
  return schema.validate(data)
}

// Edit Account Validation
exports.editAccount = function editAccountValidation (data) {
  const schema = Joi.object({
    name: Joi.string()
      .required()
      .min(3),
    email: Joi.string()
      .required()
      .email()
  })
  return schema.validate(data)
}

// Change password Validation
exports.updatePassword = function updatePasswordValidation (data) {
  const schema = Joi.object({
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9-@/+*!%&.]*$')),
    confirmPassword: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp('^[a-zA-Z0-9-@/+*!%&.]*$'))
  })
  return schema.validate(data)
}
