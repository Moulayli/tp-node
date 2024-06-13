const form = require('express-form')
const filter = form.filter
const validate = form.validate

const LoginForm = form(
  filter("email").trim(),
  validate('email').required().isEmail('Email malformed'),
  
  filter('password').trim(),
  validate('password').required()
)

const CreateBarForm = form(  
  filter('name').trim(),
  validate('name').required(),

  filter('adresse'),
  validate('adresse').required(),
  
  filter('tel').trim(),
  validate('tel').is(/^\d+$/),

  filter("email").trim(),
  validate('email').required().isEmail('Email malformed'),
  
  filter('password').trim(),
  validate('password').required(),
)

module.exports = {LoginForm, CreateBarForm}