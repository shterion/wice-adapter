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

  // Create a session in wice and then make a request to create a new organization
  wice.createSession(cfg, () => {
    if (cfg.cookie) {

      let organization = JSON.stringify(msg.body);
      let existingRowid = 0;

      let options = {
        method: 'POST',
        uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
        form: {
          method: '',
          cookie: '',
          data: ''
        },
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      checkForExistingCompany().then(() => {
        if (existingRowid == 0) {
          console.log('Creating an organization ...');
          requestToWice('insert_company', organization);

        } else {
          msg.body.rowid = existingRowid;
          requestToWice('update_company', organization);
        }
      });

      function checkForExistingCompany() {

        options.form = {
          method: 'get_all_companies',
          cookie: cfg.cookie,
          ext_search_do: 1,
          name: msg.body.name
        };

        return new Promise((resolve, reject) => {
          request.post(options)
            .then((res) => {
              let resObj = JSON.parse(res);
              if (resObj.loop_addresses) {
                existingRowid = resObj.loop_addresses[0].rowid;
                console.log(`Organization alredy exists ... ROWID: ${existingRowid}`);
              }
              resolve(true);
            })
            .catch((err) => {
              reject(err);
            });
        });
      };

      function requestToWice(method, organization) {
        options.form = {
          method,
          cookie: cfg.cookie,
          data: organization
        };

        request.post(options).then((res) => {
          reply = res;
          emitData();

        }).catch((e) => {
          emitError();
          console.log(`ERROR: ${e}`);
        });
      }

      // let uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=insert_company&cookie=${cfg.cookie}&data=${organization}`;
      // // Send a request to create a new organization
      // request.get(uri)
      //   .then((res) => {
      //     reply = res;
      //     emitData();
      //   }, (err) => {
      //     emitError();
      //   }).catch((e) => {
      //     emitError();
      //     console.log(`ERROR: ${e}`);
      //   });
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
