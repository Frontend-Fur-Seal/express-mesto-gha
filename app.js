const express = require('express');

const { PORT = 3000 } = process.env;

const app = express();

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})

app.get('/', (req, res) => {
    res.send(
          `<html>
          <body>
              <p>Ответ на сигнал из далёкого космоса:</p>
              <h1>Привет!</h1>
          </body>
          </html>`
      );
  });