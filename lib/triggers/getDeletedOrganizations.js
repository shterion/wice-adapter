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

async function getCategoryRowid(cookie, snapshot = {}) {
  snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();
  console.log(`Last updated: ${snapshot.lastUpdated}`);

  try {
    const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&cookie=${cookie}`;
    const categoryRowId = await request.get(uri);
    const categoryRowIdObj = JSON.parse(categoryRowId);
    return categoryRowIdObj.global_config.trash_address_company_category1;
  } catch (e) {
    throw new Error(e);
  }
}

async function getDeletedOrganizations(options) {
  try {
    let result = [];
    const organizations = await request.get(options);
    const organizationsObj = JSON.parse(organizations);

    if (organizationsObj.loop_addresses === undefined) throw 'No organizations found ...';

    if (!organizationsObj.loop_addresses || !Array.isArray(organizationsObj.loop_addresses)) {
     throw `Expected records array. Instead received: ${JSON.stringify(organizationsObj.loop_addresses)}`;
    }
    organizationsObj.loop_addresses.forEach((organization) => {
      let customOrganizationFormat = {
        rowid: organization.rowid,
        name: organization.name,
        last_update: organization.last_update
      };
      customOrganizationFormat.last_update > snapshot.lastUpdated && result.push(customOrganizationFormat);
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

(async function() {
  try {
    const cookie = await createSession(cfg);
    const categoryId = await getCategoryRowid(cookie);
    const options = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_companies&full_list=1&address_category1=${categoryId}&select_category1=${categoryId}&ext_search_do=1&cookie=${cookie}`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    snapshot = {
      lastUpdated: '2018-03-11 09:00:00'
    };

    getDeletedOrganizations(options, snapshot)
      .then((res) => {
        console.log(res.length);
        return res;
      })
      .catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();
