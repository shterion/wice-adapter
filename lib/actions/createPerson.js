const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Ferguson',
  firstname: 'Peter',
  for_rowid: 367660
}

wice.createSession(cfg, () => {
  let cookie = cfg.cookie;
  let path = cfg.path;
  let user = JSON.stringify(input);

  const uri = `${path}/pserv/base/json?method=insert_contact&cookie=${cookie}&data=${user}`;

  request.get(uri).then((user) => {
    let newUser = JSON.parse(user);
    console.log(`NEW USER ADDED: ${JSON.stringify(newUser, undefined, 2)}`);
  })
});
