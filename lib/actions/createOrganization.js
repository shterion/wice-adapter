const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Some Company Ltd.'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let organization = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=insert_company&cookie=${cfg.cookie}&data=${organization}`;

    try {
      let newOrganization = await request.get(uri);
      console.log(`NEW COMPANY ADDED: ${organization}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
