"use strict";
const Q = require('q');
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

    function getPersons() {

      return new Promise((resolve, reject) => {
        let uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_persons&cookie=${cfg.cookie}`;
        let requestOptions = {
          uri,
          headers: {
            'X-API-KEY': cfg.apikey
          }
        };

        request.get(requestOptions).then((res) => {
          //TODO: error handlung when res is empty
          let resObj = JSON.parse(res);
          // contacts = resObj.loop_addresses;
          let customUserFormat;

          if (resObj.loop_addresses == undefined) {
            reject();
          }

          resObj.loop_addresses.forEach((user) => {
            customUserFormat = {
              rowid: user.rowid,
              for_rowid: user.for_rowid,
              name: user.name,
              firstname: user.firstname,
              email: user.email,
              title: user.title,
              salutation: user.salutation,
              date_of_birth: user.date_of_birth,
              private_street: user.private_street,
              private_street_number: user.private_street_number,
              private_zip_code: user.private_zip_code,
              private_town: user.private_town,
              private_state: user.state,
              private_country: user.private_country,
              house_post_code: user.house_post_code,
              phone: user.phone,
              fax: user.fax,
              private_phone: user.private_phone,
              private_mobile_phone: user.private_mobile_phone,
              private_email: user.private_email
            };
            contacts.push(customUserFormat);
          });
          resolve(contacts);
        }).catch((e) => {
          reject(e);
        });
      });
    }

    function emitData() {
      let data = messages.newMessageWithBody({
        "persons": contacts
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
      .then(getPersons)
      .then(emitData)
      .fail(emitError)
      .done(emitEnd);

  });
}
