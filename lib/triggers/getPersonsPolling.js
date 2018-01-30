"use strict";
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const wice = require('./../actions/wice');

exports.process = processTrigger;

/**
 *  This method will be called from elastic.io platform providing following data
 *
 * @param msg
 * @param cfg
 */
function processTrigger(msg, cfg) {

  let contacts = [];
  let self = this;

  // Create a session in wice and then make a post request to get all persons saved by a specific user in snazzycontacts

  wice.createSession(cfg, () => {
      console.log('HERE');
      console.log(cfg.cookie);
      let uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_persons&cookie=${cfg.cookie}`;
      console.log(uri);

      // Make a post request to get all persons saved by a specific user in snazzycontacts
      request.get(uri).then((res) => {
        // console.log(res);
        let resObj = JSON.parse(res);
        contacts = resObj.loop_addresses;
        emitData();
        // console.log(`CONTACTS LENGTH:${resObj.loop_addresses.length}`);
        // console.log(JSON.stringify(resObj.loop_addresses, undefined, 2));
      }, (err) => {
        emitError();
      }).catch((e) => {
        console.log(`ERROR: ${e}`);
      });

  });

  // Emit data from promise depending on the result
  function emitData() {
    let data = messages.newMessageWithBody({
      "persons": contacts
    });
    console.log('Emitdata: '+ JSON.stringify(data, undefined, 2));
    self.emit('data', data);
  }

  function emitError(e) {
    console.log(`ERROR: ${e}`);

    self.emit('error', e);
  }
}
