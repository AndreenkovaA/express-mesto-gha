const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '64a314220ea958a79291c708'
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use((req, res) => { res.status(404).send({ message: 'Страница не найдена.' });  })

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})

module.exports = app;