const mongoose = require('mongoose');
require('mongoose-type-url');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  image: {
    type: mongoose.SchemaTypes.Url,
    required: true,
  },
  owner: {
    type: mongoose.Types.ObjectId,
    required: true,
    select: false,
  },
});

module.exports.articleModel = mongoose.model('article', articleSchema);
