const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');

const { errors } = require('celebrate');
const auth = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

const NotFoundError = require('./errors/NotFoundError');
const ErrorHandler = require('./errors/ErrorHandler');

const { validationSignin, validationSignup } = require('./middlewares/celebrateValidation');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('connected to db');
  }).catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.post('/signin', validationSignin, login);
app.post('/signup', validationSignup, createUser);

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use('/*', auth, (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());
app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
