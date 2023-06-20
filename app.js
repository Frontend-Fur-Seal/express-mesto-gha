const express = require('express');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://0.0.0.0/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send(`<html>
      <body>
        <p>Ответ на сигнал из далёкого космоса:</p>
        <h1>Привет, человек!</h1>
      </body>
  </html>`);
});
