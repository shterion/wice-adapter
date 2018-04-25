"use strict";
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const wice = require('./../actions/wice.js');

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

  // Create a session in Wice

  wice.createSession(cfg, () => {

      let uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_persons&cookie=${cfg.cookie}`;
      let requestOptions = {
        uri,
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      // Make a get request to fetch all persons
      request.get(requestOptions).then((res) => {
        let resObj = JSON.parse(res);
        contacts = resObj.loop_addresses;



        let customUserFormat;
        let result = [];

        resObj.loop_addresses.forEach((user) => {
          customUserFormat = {
            rowid: user.rowid,
            name: user.name,
            firstname: user.firstname,
            email: user.email
          };
          result.push(customUserFormat)
        });
        console.log(`LENGTH: ${result}`);


        emitData();
      }, (err) => {
        emitError();
      }).catch((e) => {
        console.log(`ERROR: ${e}`);
      });
  });

  // Emit data from promise depending on the result
  function emitData() {
    let data = messages.newMessageWithBody({
      "persons": result
    });
    // console.log('Emit data: '+ JSON.stringify(data, undefined, 2));
    self.emit('data', data);
  }

  function emitError(e) {
    console.log(`ERROR: ${e}`);

    self.emit('error', e);
  }
}
