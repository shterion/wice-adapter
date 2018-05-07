"use strict";
const Q = require('q');
const request = require('request-promise');
const messages = require('elasticio-node').messages;

const wice = require('./../actions/wice.js');

exports.process = processTrigger;

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */

function processTrigger(msg, cfg) {

  // Create a session in Wice
  wice.createSession(cfg, () => {
    if (cfg.cookie) {

      let organization = [];
      const self = this;

      function getOrganization() {
        
        return new Promise((resolve, reject) => {
          const options = {
            uri: `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_company&cookie=${cfg.cookie}&pkey=${msg.body.rowid}`,
            headers: {
              'X-API-KEY': cfg.apikey
            }
          };

          request.get(options)
            .then((res) => {
              let resObj = JSON.parse(res);
              organization = {
                rowid: resObj.rowid,
                name: resObj.name,
                street: resObj.street,
                street_number: resObj.streetnumber,
                town: resObj.town,
                country: resObj.country,
              };
              resolve(organization);
            }).catch((e) => {
              reject(e);
            });
        });
      }

      function emitData() {
        const data = messages.newMessageWithBody({
          "organization": organization
        });
        self.emit('data', data);
      }

      function emitError(e) {
        console.log(`ERROR: ${e}`);
        self.emit('error', e);
      }

      function emitEnd() {
        console.log('Finished execution');
        self.emit('end');
      }

      Q()
        .then(getOrganization)
        .then(emitData)
        .fail(emitError)
        .done(emitEnd);
    }
  });
}
