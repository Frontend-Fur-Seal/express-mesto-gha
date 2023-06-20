const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');

/* eslint-disable import/no-extraneous-dependencies */
const mongoose = require('mongoose');

const path = require('path');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
