const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getMyArticles, addArticles, deleteArticles } = require('../controllers/articles');

router.get('', getMyArticles);
router.post('', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    text: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().pattern(new RegExp('https?://(www.)?[-a-zA-Z0-9@:%.+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%+.~#?&//=]*)')),
    image: Joi.string().required().pattern(new RegExp('https?://(www.)?[-a-zA-Z0-9@:%.+~#=]{1,256}.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%+.~#?&//=]*)')),
  }),
}), addArticles);
router.delete('/:articleId', celebrate({
  params: Joi.object().keys({
    articleId: Joi.string(),
  }),
}), deleteArticles);

module.exports = router;
