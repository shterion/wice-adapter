const request = require('request-promise');

exports.createSession = function (config, continueOnSuccess) {

  const path = "https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json";
  console.log(`API KEY: ${config.apikey}`);

  request.post(path, {
    form: {
      "method": "login",
      "mandant_name": config.mandant,
      "username": config.username,
      "password": config.password
    },
    headers: {
      'X-API-KEY': config.apikey
    }
  }, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body);
      config['cookie'] = data['cookie'];
      console.log(`COOKIE: ${config['cookie']}`);
      continueOnSuccess();
    } else if (error) {
      console.log(error);
    }
  });
}
