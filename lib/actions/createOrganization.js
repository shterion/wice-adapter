const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'TEST GmbH'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let organization = JSON.stringify(input);
    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_company&cookie=${cfg.cookie}&data=${organization}`;

    request.get(uri).then((res) => {
      let newOrganization = JSON.parse(res);
      console.log(`Organization: ${newOrganization['rowid']}`);
    }, (err) => {
      console.log(`ERROR: ${err}`);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let newOrganization = await request.get(uri);
    //   console.log(`NEW COMPANY ADDED: ${organization}`);
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
