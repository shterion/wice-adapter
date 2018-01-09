const request = require('request');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

function createSession(cfg) {
  let mandant = cfg.mandant;
  let username = cfg.username;
  let password = cfg.password;
  let path = cfg.path;

  let fullPath = `${path}/pserv/base/json?method=login&username=${username}&mandant_name=${mandant}&password=${password}`;


  request.get(fullPath, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      let data = JSON.parse(body);
      let cookie = data['cookie'];
      console.log(cookie);
    }
  });
}

createSession(cfg);
