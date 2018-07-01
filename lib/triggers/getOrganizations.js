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

async function getOrganizations(options) {
  try {
    let result = [];
    const organizations = await request.get(options);
    const organizationsObj = JSON.parse(organizations);

    organizationsObj.loop_addresses.forEach((person) => {
      const currentPerson = customOrganization(person);
      result.push(currentPerson);
    });
    return result;
  } catch (e) {
    throw new Error(e);
  }
}

function customOrganization(organization) {
  const customOrganizationFormat = {
    rowid: organization.rowid,
    name: organization.name,
    email: organization.email,
    phone: organization.phone,
    fax: organization.fax,
    street: organization.street,
    street_number: organization.street_number,
    zip_code: organization.zip_code,
    p_o_box: organization.p_o_box,
    town: organization.town,
    state: organization.state,
    country: organization.country

  };
  return customOrganizationFormat;
}

(async function() {
  try {
    const cookie = await createSession(cfg);
    const options = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&full_list=1&cookie=${cookie}`,
      headers: { 'X-API-KEY': cfg.apikey }
    };

    getOrganizations(options)
      .then((res) => {
        console.log(res.length);
        return res;
      })
      .catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();

module.exports = {
  createSession,
  getOrganizations
};
