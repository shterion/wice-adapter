const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 410866
};

wice.createSession(cfg, () => {
  let cookie = cfg.cookie;
  let path = cfg.path;

  let deleteUser = JSON.stringify(input);
  const uri = `${path}/pserv/base/json?method=delete_contactperson&cookie=${cookie}&data=${deleteUser}`;

  // console.log(uri);
  request.get(uri).then((user) => {
    let newUser = JSON.parse(user);
    console.log(`DELETED USER: ${JSON.stringify(newUser, undefined, 2)}`);
  });
});
