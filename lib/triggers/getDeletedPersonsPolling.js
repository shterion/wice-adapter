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
 */
function processTrigger(msg, cfg,  snapshot = {}) {

  const self = this;
  let contacts = [];

  snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();
  console.log(`Last Updated: ${snapshot.lastUpdated}`);

  async function fetchAll(options) {
    try {
      let result = [];
      const persons = await request.get(options);
      const personsObj = JSON.parse(persons);

      if (personsObj.loop_addresses === undefined) throw 'No persons found ...';

      personsObj.loop_addresses.filter((person) => {
        if (person.deactivated == 1) {
          const currentPerson = customPerson(person);
          currentPerson.last_update > snapshot.lastUpdated && result.push(currentPerson);
        } else {
          console.log('HERE');
          return result;
        }
      })

      result.sort((a, b) => Date.parse(a.last_update) - Date.parse(b.last_update));
      return result;

    } catch (e) {
      throw new Error(e);
    }
  }

  function customPerson(person) {
    const customUserFormat = {
      rowid: person.rowid,
      for_rowid: person.for_rowid,
      same_contactperson: person.same_contactperson,
      last_update: person.last_update,
      deactivated: person.deactivated,
      name: person.name,
      firstname: person.firstname,
      email: person.email,
      title: person.title,
      salutation: person.salutation,
      birthday: person.birthday,
      private_street: person.private_street,
      private_street_number: person.private_street_number,
      private_zip_code: person.private_zip_code,
      private_town: person.private_town,
      private_state: person.private_state,
      private_country: person.private_country,
      phone: person.phone,
      fax: person.fax,
      private_phone: person.private_phone,
      private_mobile_phone: person.private_mobile_phone,
      private_email: person.private_email
    };
    return customUserFormat;
  }

  async function getDeletedPersons() {
    try {
      const cookie = await createSession(cfg);
      const options = {
        uri: `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_persons&full_list=1&cookie=${cookie}`,
        headers: { 'X-API-KEY': cfg.apikey }
      };
      contacts = await fetchAll(options);
      console.log(`CONTACTS: ${contacts}`);

      if (!contacts || !Array.isArray(contacts)) throw `Expected records array. Instead received: ${JSON.stringify(contacts)}`;

      return contacts;
    } catch (e) {
      console.log(`ERROR: ${e}`);
      throw new Error(e);
    }
  }
  function emitData() {
    console.log(`Found ${contacts.length} new records.`);

    if (contacts.length > 0) {
      contacts.forEach(elem => {
        self.emit('data', messages.newMessageWithBody(elem));
      });
      snapshot.lastUpdated = contacts[contacts.length - 1].last_update;
      console.log(`New snapshot: ${snapshot.lastUpdated}`);
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
    .then(getDeletedPersons)
    .then(emitData)
    .fail(emitError)
    .done(emitEnd);
}


// /////////
//   // Create a session in Wice
//   wice.createSession(cfg, () => {
//
//     if (cfg.cookie) {
//       let deletedContacts = [];
//       const self = this;
//
//       function getPersons() {
//         return new Promise((resolve, reject) => {
//           const requestOptions = {
//             uri: `https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json?method=get_all_persons&full_list=1&cookie=${cfg.cookie}`,
//             headers: {
//               'X-API-KEY': cfg.apikey
//             }
//           };
//
//           request.get(requestOptions)
//             .then((res) => {
//               const resObj = JSON.parse(res);
//               let customPersonFormat;
//               let deletedPersons = [];
//
//               if (resObj.loop_addresses == undefined) {
//                 reject('No contacts found ...');
//               }
//
//               resObj.loop_addresses.forEach((user) => {
//                 if (user.deactivated == 1) {
//                   customPersonFormat = {
//                     rowid: user.rowid,
//                     for_rowid: user.for_rowid,
//                     name: user.name,
//                     firstname: user.firstname,
//                     email: user.email,
//                     title: user.title,
//                     salutation: user.salutation,
//                     date_of_birth: user.date_of_birth,
//                     private_street: user.private_street,
//                     private_street_number: user.private_street_number,
//                     private_zip_code: user.private_zip_code,
//                     private_town: user.private_town,
//                     private_state: user.state,
//                     private_country: user.private_country,
//                     phone: user.phone,
//                     fax: user.fax,
//                     private_phone: user.private_phone,
//                     private_mobile_phone: user.private_mobile_phone,
//                     private_email: user.private_email
//                   };
//                   deletedContacts.push(customPersonFormat);
//                 }
//               });
//               resolve(deletedContacts);
//             }).catch((e) => {
//               reject(e);
//             });
//         });
//       }
//
//       function emitData() {
//         const data = messages.newMessageWithBody({
//           "persons": deletedContacts
//         });
//         self.emit('data', data);
//       }
//
//       function emitError(e) {
//         console.log(`ERROR: ${e}`);
//         self.emit('error', e);
//       }
//
//       function emitEnd() {
//         console.log('Finished execution');
//         self.emit('end');
//       }
//
//       Q()
//         .then(getPersons)
//         .then(emitData)
//         .fail(emitError)
//         .done(emitEnd);
//     }
//   });
// }
