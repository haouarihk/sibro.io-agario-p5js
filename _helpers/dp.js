/* eslint-disable linebreak-style */
/* eslint-disable max-len */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
const config = require('config.json');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
  User: require('../users/user.model').default,
};
