const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const auth = require('./middlewares/auth');

const { login, createUser } = require('./controllers/users');

const ErrorHandler = require('./errors/ErrorHandler');

const { errors } = require('celebrate');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('connected to db');
  }).catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(bodyParser.json());

app.post('/signin', login);

app.post('/signup', createUser);

app.use(errors());

app.use('/users', auth, require('./routes/users'));
app.use('/cards', auth, require('./routes/cards'));

app.use((req, res) => {
  res.status(404).send({ message: 'Incorrect' });
});

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
