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

const options = {
  method: 'POST',
  uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
  headers: {
    'X-API-KEY': cfg.apikey
  }
};

const input = {
  description: 'Arduino Nano 4',
  number: 8889,
  sales_price: 100
};

async function checkForExistingArticle(article, cookie) {
  let existingRowid = 0;
  try {
    options.form = {
      method: 'get_all_articles',
      cookie: cookie,
      search_filter: input.description
    };
    const rowid = await request.post(options);
    const rowidObj = JSON.parse(rowid);

    if (rowidObj.loop_articles) {
      existingRowid = rowidObj.loop_articles[0].rowid;
      console.log(`Article already exists ... ROWID: ${existingRowid}`);
    }
    return existingRowid;
  } catch (e) {
    throw new Error(e);
  }
}

async function createOrUpdateArticle(existingRowid, cookie) {
  const data = JSON.stringify(input);
  try {
    options.form = { cookie, data };

    if (existingRowid == 0) {
      console.log('Creating article ...');
      options.form.method = 'insert_article';
      const article = await request.post(options);
      return article;
    } else {
      console.log('Updating article ...');
      input.rowid = existingRowid;
      options.form.method = 'update_article';
      options.form.data = JSON.stringify(input);
      const article = await request.post(options);
      return article;
    }
  } catch (e) {
    throw new Error(e);
  }
}

(async function () {
  try {
    const cookie =  await createSession(cfg);
    const existingRowid = await checkForExistingArticle(input, cookie);
    createOrUpdateArticle(existingRowid, cookie);
  } catch (e) {
    throw new Error(e);
  }
})();
