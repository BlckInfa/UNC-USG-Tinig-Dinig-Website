module.exports = {
  ...require('./auth.middleware'),
  ...require('./validation.middleware'),
  errorHandler: require('./errorHandler'),
};
