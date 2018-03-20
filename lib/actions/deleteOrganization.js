const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 367979
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let organization = JSON.stringify(input);
    // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=delete_company&cookie=${cfg.cookie}&data=${organization}`;
    let options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      form: {
        method: 'delete_company',
        cookie: cfg.cookie,
        data: organization
      },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.post(options).then((res) => {
      let deletedOrganization = JSON.parse(res);
      console.log(JSON.stringify(deletedOrganization, undefined, 2));
    }, (err) => {
      console.log(`ERROR: ${err}`);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let deletedOrganization = await request.get(uri);
    //   console.log(`DELETED ORGANIZATION: ${deletedOrganization}`);
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
