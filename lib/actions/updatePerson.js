"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// Update an user
let input = {
  rowid: 410853,
  name: 'Thomass'
};


wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=update_contact&cookie=${cfg.cookie}&data=${user}`;

    request.get(uri).then((res) => {
      let updatedPerson = JSON.parse(res);
      console.log(JSON.stringify(updatedPerson, undefined, 2));
    }, (err) => {
      console.log(`ERROR: ${err}`);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let updatedPerson = await request.get(uri);
    //   // let updatedUser = JSON.parse(person);
    //   console.log(`UPDATED PERSON: ${updatedPerson}`);
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
