process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const request = require('request-promise');

function createSession(config, continueOnSuccess) {

  console.log(`API KEY: ${config.apikey}`);
  const options = {
    uri: `${config.path}/plugin/wp_elasticio_backend/json`,
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
      let data = JSON.parse(res);
      config['cookie'] = data['cookie'];
      console.log(`COOKIE: ${config['cookie']}`);
      continueOnSuccess();
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });
}

module.exports = {
  createSession
};
