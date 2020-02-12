const mongoose = require('mongoose');
const User = require('../models/user').usersModel;
const NotFoundError = require('../errors/NotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../errors/UnauthorizedError');
const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getCurrentUser = (req, res, next)=>{
    if (mongoose.Types.ObjectId.isValid(req.user._id)) {
        User.findById(req.user._id)
            .then((result) => {
                if (result) {
                    res.json({ data: result });
                } else {
                    throw new NotFoundError('Пользователь не найден');
                }
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

module.exports.createUser = (req, res, next) => {
    const {
        name, email, password
    } = req.body;
    bcrypt.hash(password, 10)
        .then((hash) => {
            User.create({
                name, email, password: hash
            })
                .then(() => {
                    res.status(201).json({
                        user: {
                            name, email
                        },
                    });
                })
                .catch(() => {
                    throw new InternalServerError('Произошла ошибка');
                })
                .catch(next);
        })
        .catch(() => {
            throw new InternalServerError('Произошла ошибка');
        })
        .catch(next);
};


module.exports.login = (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({ email }).select('+password')
        .then((data) => {
            if (data) {
                bcrypt.compare(password, data.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({
                            _id: data._id,
                        }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
                        res.send({ token });
                    } else {
                        try {
                            throw new UnauthorizedError('Ошибка авторизации');
                        } catch (error) {
                            next(error);
                        }
                    }
                });
            } else {
                throw new UnauthorizedError('Ошибка авторизации');
            }
        })
        .catch(next);
};