const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 410865
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=delete_contactperson&cookie=${cfg.cookie}&data=${user}`;

    try {
      let deletedPerson = await request.get(uri);
      console.log(`DELETED PERSON: ${deletedPerson}}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
