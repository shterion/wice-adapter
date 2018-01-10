process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const request = require('request-promise');

function createSession(cfg, continueOnSuccess) {

  const path = `${cfg.path}/pserv/base/json?method=login&username=${cfg.username}&mandant_name=${cfg.mandant}&password=${cfg.password}`;

  request.get(path, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body);
      cfg['cookie'] = data['cookie'];
      continueOnSuccess();
    }
  });
}

module.exports = {createSession};
