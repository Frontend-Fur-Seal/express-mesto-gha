const { celebrate, Joi } = require('celebrate');

const validationSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(10),
  })
})

const validationSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2).max(10),
  }).unknown(true),
})

module.exports = {
  validationSignin,
  validationSignup,
}