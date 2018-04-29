process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const request = require('request-promise');

function createSession(config, continueOnSuccess) {

  const path = `${config.path}/plugin/wp_elasticio_backend/json`;
  // const path = `${config.path}/plugin/wp_elasticio_backend/json?method=login&username=${config.username}&mandant_name=${config.mandant}&password=${config.password}`;
  console.log(`API KEY: ${config.apikey}`);

  const options = {
    uri: path,
    form: {
      "method": "login",
      "mandant_name": config.mandant,
      "username": config.username,
      "password": config.password
    },
    headers: {
      'X-API-KEY': config.apikey
    }
  };

  request.post(options)
    .then((res) => {
      const data = JSON.parse(res);
      config.cookie = data.cookie;
      console.log(`COOKIE: ${config['cookie']}`);
      continueOnSuccess();
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
}

module.exports = {
  createSession
};
