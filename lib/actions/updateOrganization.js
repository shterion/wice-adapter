"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// Update an user
let input = {
  rowid: 367664,
  name: 'TEST AG'
};


wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let company = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=update_company&cookie=${cfg.cookie}&data=${company}`;

    try {
      let updatedCompany = await request.get(uri);
      // let updatedUser = JSON.parse(person);
      console.log(`UPDATED COMPANY: ${updatedCompany}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
