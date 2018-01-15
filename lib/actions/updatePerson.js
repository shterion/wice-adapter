"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();


let reply = {};

// Update an user
let input = {
  rowid: 410867,
  name: 'Fox'
};


wice.createSession(cfg, () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=update_contact&cookie=${cfg.cookie}&data=${user}`;

    request.get(uri).then((user) => {
      let updatedUser = JSON.parse(user);
      console.log(`UPDATED USER: ${JSON.stringify(updatedUser, undefined, 2)}`);
    })
  } else {
    console.log('ERROR: No cookie found...');
  }
});
