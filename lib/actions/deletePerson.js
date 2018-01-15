const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 410866
};

wice.createSession(cfg, () => {
  if (cfg.cookie) {

    let deleteUser = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=delete_contactperson&cookie=${cfg.cookie}&data=${deleteUser}`;

    request.get(uri).then((user) => {
      let newUser = JSON.parse(user);
      console.log(`DELETED USER: ${JSON.stringify(newUser, undefined, 2)}`);
    });
  } else {
    console.log('ERROR: No cookie found...');
  }
});
