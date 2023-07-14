const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found-err');
const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use(router);
app.use(auth);
app.use(userRouter);
app.use(cardRouter);

app.use(() => { throw new NotFoundError('Страница не найдена.'); });

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports = app;
