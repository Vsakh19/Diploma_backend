const mongoose = require('mongoose');
const Article = require('../models/article').articleModel;
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getMyArticles = (req, res, next)=>{
    Article.find({owner: req.user.id})
        .then((result) => {
            res.json(result);
        })
        .catch(() => {
            throw new InternalServerError('Произошла ошибка');
        })
        .catch(next);
};

module.exports.addArticles = (req, res, next)=>{
    const {keyword, title, text, date, source, link, image} = req.body;
    const id = req.user._id;
    if (mongoose.Types.ObjectId.isValid(id)) {
        Article.create({ keyword, title, text, date, source, link, image, owner: id })
            .then(() => {
                res.status(201).json({ message: 'Карточка успешно создана' });
            })
            .catch((err) => {
                throw new InternalServerError(`Произошла ошибка: ${err.toString()}`);
            })
            .catch(next);
    } else {
        try {
            throw new NotFoundError('Некорректный ID');
        } catch (err) {
            next(err);
        }
    }
};

module.exports.deleteArticles = (req, res, next)=>{
    Article.findById(req.params.articleId)
        .then((result) => {
            if (result) {
                if (result.owner.equals(req.user._id)) {
                    Article.remove({ _id: req.params.articleId })
                        .then((card) => {
                            if (card) {
                                res.status(204).send();
                            } else {
                                throw new NotFoundError('Карточка не найдена');
                            }
                        })
                        .catch(next);
                } else {
                    throw new ForbiddenError('Доступ закрыт');
                }
            } else {
                throw new NotFoundError('Карточка не найдена');
            }
        })
        .catch(next);
};