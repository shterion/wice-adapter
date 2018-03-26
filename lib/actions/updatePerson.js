"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// Update an user
let input = {
  rowid: 412161,
  firstname: 'Monicä'
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_contact&cookie=${cfg.cookie}&data=${user}`;
    let options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      form: {
        method: 'update_contact',
        cookie: cfg.cookie,
        data: user
      },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.post(options).then((res) => {
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
