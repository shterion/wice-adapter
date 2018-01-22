"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// Update an user
let input = {
  rowid: 410879,
  name: 'Blah'
};


wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=update_contact&cookie=${cfg.cookie}&data=${user}`;

    try {
      let updatedPerson = await request.get(uri);
      // let updatedUser = JSON.parse(person);
      console.log(`UPDATED PERSON: ${updatedPerson}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
