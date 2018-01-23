const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 367661
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cfg.cookie}`;

    try {
      let organizations = await request.get(uri);
      let resObj = JSON.parse(organizations);

      for (const organization of Object.keys(resObj.loop_addresses)) {
        if (resObj.loop_addresses[organization].rowid == input.rowid) {
          console.log(resObj.loop_addresses[organization]);
          return resObj.loop_addresses[organization];
        }
      }

    // let getOrganization = JSON.stringify(input);
    // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_company&cookie=${cfg.cookie}&data=${getOrganization}`;
    //
    // try {
    //   let organization = await request.get(uri);
    //   console.log(JSON.parse(organization));

    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
