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

"use strict"
const request = require('request-promise');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const { createSession } = require('./../utils/wice');

let input = {
  rowid: 5768
};

async function deleteArticle(cookie) {
  let reply = [];
  let article = JSON.stringify(input);
  let options = {
    method: 'POST',
    uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
    form: {
      method: 'delete_article',
      cookie,
      data: article
    },
    headers: { 'X-API-KEY': cfg.apikey }
  };

  try {
    const deletedArticle = await request.post(options);
    return deletedArticle;
  } catch (e) {
    throw new Error(`No article with ROWID: ${input.rowid} found!`);
  }
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    const deletedArticle = await deleteArticle(cookie);
    console.log(JSON.parse(deletedArticle));
    return deletedArticle;
  } catch (e) {
    throw new Error(e);
  }
})();

// wice.createSession(cfg, async () => {
//   if (cfg.cookie) {
//
//     let article = JSON.stringify(input);
//     // const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=delete_article&cookie=${cfg.cookie}&data=${article}`;
//     let options = {
//       method: 'POST',
//       uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
//       form: {
//         method: 'delete_article',
//         cookie: cfg.cookie,
//         data: article
//       },
//       headers: {
//         'X-API-KEY': cfg.apikey
//       }
//     };
//
//     request.post(options).then((res) => {
//       let deletedArticle = JSON.parse(res);
//       console.log(JSON.stringify(deletedArticle, undefined, 2));
//     }, (err) => {
//       console.log(`ERROR: ${err}`);
//     }).catch((e) => {
//       console.log(`ERROR: ${e}`);
//     });
//
//     // try {
//     //   let deletedArticle = await request.get(uri);
//     //   // console.log(`DELETED ARTICLE: ${deletedArticle}`);
//     // } catch (e) {
//     //   console.log(`ERROR: ${e}`);
//     // }
//
//   } else {
//     console.log('ERROR: No cookie found...');
//   }
// });
