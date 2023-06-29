const { celebrate, Joi } = require('celebrate');

const { RegExp } = require('../controllers/constants');

const validationSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  })
})

const validationSignup = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(RegExp),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(2),
  })
})

const validationCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(RegExp),
  }).unknown(true),
})

module.exports = {
  validationSignin,
  validationSignup,
  validationCreateCard,
}