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

  // Create a session in wice and then make a post request to create a new person in snazzycontacts
  wice.createSession(cfg, () => {

  console.log(`TYPE: ${typeof msg.body}`);
  console.log(`BODY: ${msg.body}`);

      let uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${msg.body}`;

console.log(`URI: ${uri}`);
      // Make a post request to create a new person in wice
      request.get(uri).then((res) => {
        reply = res;
        emitData();
        // let newPerson = JSON.parse(res);
        // console.log(JSON.stringify(newPerson, undefined, 2));
        console.log(res.rowid);
      }, (err) => {
        console.log(`ERROR: ${err}`);
      }).catch((e) => {
        emitError();
        console.log(`ERROR: ${e}`);
      });
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
