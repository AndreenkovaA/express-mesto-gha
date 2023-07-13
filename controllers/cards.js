const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const id = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner: id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const e = new BadRequestError('Переданы некорректные данные при создании карточки.');
        next(e);
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (card.owner.toString() === req.user._id) {
          Card.deleteOne({ _id: card._id }, { new: true })
            .then(() => {
              res.send({ data: card });
            })
            .catch(next);
        } else {
          const err = new Error('Карточка Вам не принадлежит.');
          err.statusCode = 403;
          next(err);
        }
      } else {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new BadRequestError('Карточка с указанным _id не найдена.');
        next(e);
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.');
        next(e);
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundError('Передан несуществующий _id карточки.');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const e = new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.');
        next(e);
      }
      next(err);
    });
};
