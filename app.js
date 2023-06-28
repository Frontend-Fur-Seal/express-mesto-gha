const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { login, createUser } = require('./controllers/users');

const ErrorHandler = require('./errors/ErrorHandler')

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('connected to db');
  }).catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(bodyParser.json());

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.post('/signin', login);
app.post('/signup', createUser);

app.use((req, res) => {
  res.status(404).send({ message: 'Incorrect' });
});

app.use(ErrorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
