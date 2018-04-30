"use strict";
const Q = require('q');
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

  let organizations = [];
  let self = this;

  // Create a session in Wice

  wice.createSession(cfg, () => {

    function getOrganizations() {

      return new Promise((resolve, reject) => {
        let uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cfg.cookie}`;
        let requestOptions = {
          uri,
          headers: {
            'X-API-KEY': cfg.apikey
          }
        };

        request.get(requestOptions).then((res) => {
          //TODO: error handlung when res is empty
          let resObj = JSON.parse(res);
          // organizations = resObj.loop_addresses;
          let customOrganizaiontFormat;

          if (resObj.loop_addresses == undefined) {
            reject('No organizations found ...'); // return ?
          }
           // else {
            resObj.loop_addresses.forEach((organization) => {
              customOrganizaiontFormat = {
                rowid: organization.rowid,
                name: organization.name,
                number_of_employees: organization.number_of_employees,
                email: organization.email,
                phone: organization.phone,
                fax: organization.fax,
                street: organization.street,
                street_number: organization.street_number,
                zip_code: organization.zip_code,
                p_o_box: organization.p_o_box,
                town: organization.town,
                town_area: organization.town_area,
                state: organization.state,
                country: organization.country
              };
              organizations.push(customOrganizaiontFormat)
            });
          // }
          resolve(organizations);
        }).catch((e) => {
          reject(e);
        });
      });
    }

    function emitData() {
      let data = messages.newMessageWithBody({
        "organizations": organizations
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
      .then(getOrganizations)
      .then(emitData)
      .fail(emitError)
      .done(emitEnd);

  });
}
