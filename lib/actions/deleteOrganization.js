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

let input = {
  rowid: 367987
};

async function deleteOrganization(cookie) {
  const organization = JSON.stringify(input);
  const options = {
    method: 'POST',
    uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
    form: {
      method: 'delete_company',
      cookie,
      data: organization
    },
    headers: { 'X-API-KEY': cfg.apikey }
  };

  try {
    const deletedOrganization = await request.post(options);
    return deletedOrganization;
  } catch (e) {
    throw new Error(`No organization with ROWID: ${input.rowid} found!`);
  }
}

  (async function() {
    try {
      const cookie = await createSession(cfg);
      const deletedOrganization = await deleteOrganization(cookie);
      console.log(JSON.parse(deletedOrganization));
      return deletedOrganization;
    } catch (e) {
      throw new Error(e);
    }
  })();


  // wice.createSession(cfg, async () => {
  //   if (cfg.cookie) {
  //
  //     let organization = JSON.stringify(input);
  //     // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=delete_company&cookie=${cfg.cookie}&data=${organization}`;
  //     let options = {
  //       method: 'POST',
  //       uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
  //       form: {
  //         method: 'delete_company',
  //         cookie: cfg.cookie,
  //         data: organization
  //       },
  //       headers: {
  //         'X-API-KEY': cfg.apikey
  //       }
  //     };
  //
  //     request.post(options).then((res) => {
  //       let deletedOrganization = JSON.parse(res);
  //       console.log(JSON.stringify(deletedOrganization, undefined, 2));
  //     }, (err) => {
  //       console.log(`ERROR: ${err}`);
  //     }).catch((e) => {
  //       console.log(`ERROR: ${e}`);
  //     });
  //
  //     // try {
  //     //   let deletedOrganization = await request.get(uri);
  //     //   console.log(`DELETED ORGANIZATION: ${deletedOrganization}`);
  //     // } catch (e) {
  //     //   console.log(`ERROR: ${e}`);
  //     // }
  //
  //   } else {
  //     console.log('ERROR: No cookie found...');
  //   }
  // });
