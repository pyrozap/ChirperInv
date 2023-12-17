const config = require('../config');

module.exports = (request, response, next) => {
  try {
    const pass = request.body.password || request.params.apipassword;

    if (config.apipassword === '') {
      error('Your API Password is not set, look at your config file.', 401);
    }

    switch (pass) {
      case '':
        error('The password you sent is empty.', 401);
        break;
      case undefined:
        error('Please send the API password.', 401);
        break;
      case config.apipassword:
        next();
        break;
      default:
        error('Invalid API password.', 401);
        break;
    }
  } catch (err) {
    response.status(401).json({
      error: 'Invalid request!',
    });
  }

  function error(msg, statusCode) {
    response.status(statusCode).json({
      error: msg,
    });
  }
};
