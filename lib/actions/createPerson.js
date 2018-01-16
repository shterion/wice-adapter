const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Smith',
  firstname: 'Peter',
  for_rowid: 367660
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;

    try {
      let newPerson = await request.get(uri);
      console.log(`NEW USER ADDED: ${newPerson}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

    // request.get(uri).then((user) => {
    //   let newUser = JSON.parse(user);
    //   console.log(`NEW USER ADDED: ${JSON.stringify(newUser, undefined, 2)}`);
    // })
    
  } else {
    console.log('ERROR: No cookie found...');
  }
});
