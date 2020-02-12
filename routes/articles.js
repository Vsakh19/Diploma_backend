const router = require('express').Router();
const {getMyArticles, addArticles, deleteArticles} = require('../controllers/articles');

router.get("", getMyArticles);
router.post("", addArticles);
router.delete("/articleId", deleteArticles);

module.exports = router;