const mongoose = require('mongoose');
const validator = require('validator');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(link) {
        // eslint-disable-next-line no-useless-escape
        // return /^(https?:\/\/)?(w{3}\.)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?\#?$/.test(v);
        return validator.isURL(link);
      },
      message: 'Ссылка не валидна',
    },
  },
  owner: {
    type: mongoose.Schema.Types.Object,
    ref: 'user',
    required: true,
    default: {},
  },
  likes: [
    {
      type: mongoose.Schema.Types.Object,
      ref: 'user',
      default: [{}],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
},
{ versionKey: false });

module.exports = mongoose.model('card', cardSchema);
