const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 367664
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let organization = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=delete_company&cookie=${cfg.cookie}&data=${organization}`;

    try {
      let deletedOrganization = await request.get(uri);
      console.log(`DELETED ORGANIZATION: ${deletedOrganization}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
