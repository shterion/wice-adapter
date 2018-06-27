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

// module.exports = function verifyCredentials(credentials, cb) {
//   console.log('Credentials passed for verification %j', credentials)
//
//   if (!credentials.apikey) {
//     console.log('Invalid apikey');
//     return cb(null, {verified: false});
//   }
//
//   if (!credentials.mandant) {
//     console.log('Invalid mandant');
//     return cb(null, {verified: false});
//   }
//
//   console.log('Credentials verified successfully');
//
//   cb(null, {verified: true});
// }


const { createSession } = require('./lib/utils/wice');

async function verifyCredentials(credentials, cb) {
  console.log('Credentials passed for verification %j', credentials)

  try {
    const cfg = {
      apikey: credentials.apikey,
      "mandant_name": credentials.mandant,
      "username": credentials.username,
      "password": credentials.password,
      "X-API-KEY": credentials.apikey
    };
    console.log(`CONFIG: ${cfg}`);

     const session = await createSession(cfg);
     console.log(session);

    throw new Error('Error in validating credentials!');
    return false;
  } catch (e) {
    console.log(`${e}`);
    throw new Error(e);
  }
}
