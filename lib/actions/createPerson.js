"use strict";
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const wice = require('./wice.js');

exports.process = processAction;

/**
 *  This method will be called from elastic.io platform providing following data
 *
 * @param msg
 * @param cfg
 */
function processAction(msg, cfg) {

  let reply = {};
  let self = this;
  let body = msg.body;
  body.same_contactperson = 'auto';

  // Create a session in wice and then make a request to create a new person
  wice.createSession(cfg, () => {
    if (cfg.cookie) {

      let contact = JSON.stringify(body);
      let uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_persons&cookie=${cfg.cookie}`;
      let flag = false;
      let requestOptions = {
        uri,
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      checkForExistingUser().then((flag) => {
        if (!flag) {
          const uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${contact}`;
          request.get(uri).then((res) => {
            reply = res;
            emitData();
          });
        }
      });

      function checkForExistingUser() {
        return new Promise((resolve, reject) => {
          request.get(requestOptions).then((res) => {
            let resObj = JSON.parse(res);

            // Best practice is with email but at this time the email is not accesible
            resObj.loop_addresses.forEach((person) => {
              if (person.name === msg.body.name) {
                console.log('Person alredy exists...');
                flag = true;
                return false; // TODO:
              }
            });
            resolve(flag);
          }).catch((e) => {
            reject(e);
          })
        });
      };


      // // Send a request to create a new person
      // request.get(uri).then((res) => {
      //   reply = res;
      //   emitData();
      //   // let newPerson = JSON.parse(res);
      //   // console.log(JSON.stringify(newPerson, undefined, 2));
      // }, (err) => {
      //   console.log(`ERROR: ${err}`);
      // }).catch((e) => {
      //   emitError();
      //   console.log(`ERROR: ${e}`);
      // });
    }
  });

  // Emit data from promise depending on the result
  function emitData() {
    let data = messages.newMessageWithBody(reply);
    self.emit('data', data);
    console.log(JSON.stringify(data, undefined, 2));
  }

  function emitError(e) {
    console.log('Oops! Error occurred');
    self.emit('error', e);
  }
}
