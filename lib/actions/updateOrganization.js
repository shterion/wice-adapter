"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// Update an user
let input = {
  rowid: 367978,
  name: 'Töstü GmbH'
};


wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let organization = JSON.stringify(input);
      // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_company&cookie=${cfg.cookie}&data=${company}`;

    let options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      form: {
        method: 'update_company',
        cookie: cfg.cookie,
        data: organization
      },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.post(options).then((res) => {
      let updatedCompany = JSON.parse(res);
      console.log(JSON.stringify(updatedCompany, undefined, 2));
    }, (err) => {
      console.log(`ERROR: ${err}`);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

  } else {
    console.log('ERROR: No cookie found...');
  }
});
