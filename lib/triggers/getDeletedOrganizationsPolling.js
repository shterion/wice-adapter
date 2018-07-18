/**
 * Copyright 2018 Wice GmbH

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
 */

"use strict";

const Q = require('q');
const request = require('request-promise');
const { messages } = require('elasticio-node');
const { createSession } = require('./../utils/wice');

exports.process = processTrigger;

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 * @param snapshot saves the current state of integration step for the future reference
 */
function processTrigger(msg, cfg, snapshot = {}) {
  const self = this;
  let organizations = [];

  snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();
  console.log(`Last Updated: ${snapshot.lastUpdated}`);

  async function getCategoryRowid(cookie) {
    try {
      const uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cookie}`;
      const categoryRowId = await request.get(uri);
      const categoryRowIdObj = JSON.parse(categoryRowId);
      return categoryRowIdObj.global_config.trash_address_company_category1;
    } catch (e) {
      throw new Error(e);
    }
  }

  async function fetchAll(options) {
    try {
      let result = [];
      const organizations = await request.get(options);

      const organizationsObj = JSON.parse(organizations);

      if (organizationsObj.loop_addresses === undefined) throw 'No organizations found ...';

      organizationsObj.loop_addresses.forEach((organization) => {
        let customOrganizationFormat = {
          rowid: organization.rowid,
          name: organization.name,
          last_update: organization.last_update
        };
        customOrganizationFormat.last_update > snapshot.lastUpdated && result.push(customOrganizationFormat);
      })

      result.sort((a, b) => Date.parse(a.last_update) - Date.parse(b.last_update));
      console.log(`HERE: ${JSON.stringify(result)}`);
      return result;
    } catch (e) {
      throw new Error(e);
    }
  }

  async function getDeletedOrganizations() {
    try {
      const cookie = await createSession(cfg);
      const categoryId = await getCategoryRowid(cookie);
      const uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_companies&full_list=1&address_category1=${categoryId}&select_category1=${categoryId}&ext_search_do=1&cookie=${cookie}`;
      const options = {
        uri,
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };
      organizations = fetchAll(options);

      if (!organizations || !Array.isArray(organizations)) throw `Expected records array. Instead received: ${JSON.stringify(organizations.loop_addresses)}`;

      return organizations;
    } catch (e) {
      console.log(`ERROR: ${e}`);
      throw new Error(e);
    }
  }

  function emitData() {
    console.log(`Found ${organizations.length} new records.`);

    if (organizations.length > 0) {
      organizations.forEach(elem => {
        self.emit('data', messages.newMessageWithBody(elem));
      });
      snapshot.lastUpdated = organizations[organizations.length - 1].last_update;
      console.log(`New snapshot: ${snapshot.lastUpdated}`);
      self.emit('snapshot', snapshot);
    } else {
      self.emit('snapshot', snapshot);
    }
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
    .then(getDeletedOrganizations)
    .then(emitData)
    .fail(emitError)
    .done(emitEnd);
}

//
// ////////////////
// // Create a session in Wice
// wice.createSession(cfg, () => {
//   if (cfg.cookie) {
//     let organizations = [];
//     const self = this;
//
//     function getCategoryRowid() {
//       return new Promise((resolve, reject) => {
//         const uri = `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cfg.cookie}`;
//         request.get(uri)
//           .then((res) => {
//             const resObj = JSON.parse(res);
//             resolve(resObj.global_config.trash_address_company_category1);
//           }).catch((e) => {
//             reject(`ERROR: ${e}`);
//           });
//       });
//     }
//
//     function getDeletedOrganizations(categoryId) {
//       return new Promise((resolve, reject) => {
//         const requestOptions = {
//           uri: `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_companies&full_list=1&address_category1=${categoryId}&select_category1=${categoryId}&ext_search_do=1&cookie=${cfg.cookie}`,
//           headers: {
//             'X-API-KEY': cfg.apikey
//           }
//         };
//
//         request.get(requestOptions)
//           .then((res) => {
//             const resObj = JSON.parse(res);
//             let customOrganizaiontFormat;
//
//             if (resObj.loop_addresses == undefined) {
//               reject('No organizations found ...');
//             }
//
//             resObj.loop_addresses.forEach((organization) => {
//               customOrganizaiontFormat = {
//                 rowid: organization.rowid,
//                 name: organization.name,
//                 number_of_employees: organization.number_of_employees,
//                 email: organization.email,
//                 phone: organization.phone,
//                 fax: organization.fax,
//                 street: organization.street,
//                 street_number: organization.street_number,
//                 zip_code: organization.zip_code,
//                 p_o_box: organization.p_o_box,
//                 town: organization.town,
//                 town_area: organization.town_area,
//                 state: organization.state,
//                 country: organization.country
//               };
//               organizations.push(customOrganizaiontFormat)
//             });
//             resolve(organizations);
//           }).catch((e) => {
//             reject(e);
//           });
//       });
//     }
//
//     function emitData() {
//       const data = messages.newMessageWithBody({
//         "organizations": organizations
//       });
//       self.emit('data', data);
//     }
//
//     function emitError(e) {
//       console.log(`ERROR: ${e}`);
//       self.emit('error', e);
//     }
//
//     function emitEnd() {
//       console.log('Finished execution');
//       self.emit('end');
//     }
//
//     Q()
//       .then(getCategoryRowid)
//       .then(getDeletedOrganizations)
//       .then(emitData)
//       .fail(emitError)
//       .done(emitEnd);
//   }
// });
// }
