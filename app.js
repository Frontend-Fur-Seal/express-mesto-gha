const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
     const token = jwt.sign(
      { _id: user._id },
      'super-strong-secret',
      { expiresIn: '7d' });

    res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
});

app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

app.use((req, res) => {
  res.status(404).send({ message: 'Incorrect' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
