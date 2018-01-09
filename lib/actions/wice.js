process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const cfg = require('./../../config/config');

const request = require('request-promise');

function createSession(cfg) {

  let path = `${cfg.path}/pserv/base/json?method=login&username=${cfg.username}&mandant_name=${cfg.mandant}&password=${cfg.password}`;

  request.get(path).then((res) => {
    let data = JSON.parse(res);
    let cookie = data['cookie'];
    console.log(cookie);
  });

  // request.get(path, (error, response, body) => {
  //   if (!error && response.statusCode == 200) {
  //     let data = JSON.parse(body);
  //     let cookie = data['cookie'];
  //     console.log(cookie);
  //   }
  // });

}

createSession(cfg);
