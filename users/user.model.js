/* eslint-disable linebreak-style */
/* eslint-disable import/no-unresolved */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  username: { type: String, unique: true, required: true },
  hash: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  createdDate: { type: Date, default: Date.now },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);
