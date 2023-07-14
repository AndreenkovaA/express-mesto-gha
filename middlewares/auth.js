const jwt = require('jsonwebtoken');
const UnautorizedError = require('../errors/unautorized-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnautorizedError('Необходима авторизация.');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'secret-key');
  } catch (err) {
    throw new UnautorizedError('Необходима авторизация.');
  }

  req.user = payload;

  next();
};
