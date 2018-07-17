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

const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const { createSession } = require('./../utils/wice');
let snapshot;

async function getDeletedPersons(options) {
  snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();
  console.log(`Last updated: ${snapshot.lastUpdated}`);

  try {
    let result = [];
    const persons = await request.get(options);
    const personsObj = JSON.parse(persons);

    if (personsObj.loop_addresses === undefined) throw 'No persons found ...';

    if (!personsObj.loop_addresses || !Array.isArray(personsObj.loop_addresses)) {
     throw `Expected records array. Instead received: ${JSON.stringify(personsObj.loop_addresses)}`;
    }

    personsObj.loop_addresses.filter((person) => {
      if (person.deactivated == 1) {
        const currentPerson = customPerson(person);
        currentPerson.last_update > snapshot.lastUpdated && result.push(currentPerson);
      }
    })

    result.sort((a, b) => Date.parse(a.last_update) - Date.parse(b.last_update));

    if (result.length > 0) {
      snapshot.lastUpdated = result[result.length - 1].last_update;
      console.log(`New snapshot: ${snapshot.lastUpdated}`);
    }
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

(async function () {
  try {
    const cookie = await createSession(cfg);
    const options = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_persons&full_list=1&cookie=${cookie}`,
      headers: { 'X-API-KEY': cfg.apikey }
    };

    snapshot = {
      lastUpdated: '2018-03-11 09:00:00'
    };

    getDeletedPersons(options, snapshot)
      .then((res) => {
        console.log(res.length);
        return res;
      })
      .catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();
