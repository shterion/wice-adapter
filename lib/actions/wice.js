process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const request = require('request-promise');

function createSession(config, continueOnSuccess) {

  const path = `${config.path}/plugin/wp_elasticio_backend/json?method=login&username=${config.username}&mandant_name=${config.mandant}&password=${config.password}`;

  request.get(path, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body);
      config['cookie'] = data['cookie'];
      console.log(`COOKIE: ${config['cookie']}`);
      continueOnSuccess();
    }
  });
}

module.exports = {createSession};
