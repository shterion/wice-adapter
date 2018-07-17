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

async function getArticles(options, snapshot = {}) {
  snapshot.lastUpdated = snapshot.lastUpdated || (new Date(0)).toISOString();
  console.log(`Last updated: ${snapshot.lastUpdated}`);

  try {
    let result = [];
    const articles = await request.get(options);
    const articlesObj = JSON.parse(articles);

    if (articlesObj.loop_articles === undefined) throw 'No articles found ...';

    if (!articlesObj.loop_articles || !Array.isArray(articlesObj.loop_articles)) {
     throw `Expected records array. Instead received: ${JSON.stringify(articlesObj.loop_articles)}`;
    }

    articlesObj.loop_articles.filter((article) => {
      const currentArticle = customArticle(article);
      currentArticle.last_update > snapshot.lastUpdated && result.push(currentArticle);
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

function customArticle(article) {
  const customArticleFormat = {
    rowid: article.rowid,
    last_update: article.last_update,
    number: article.number,
    description: article.description,
    sales_price: article.sales_price,
    purchase_price: article.purchase_price,
    in_stock: article.in_stock,
    unit: article.unit
  };
  return customArticleFormat;
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    const options = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_articles&cookie=${cookie}`,
      headers: { 'X-API-KEY': cfg.apikey }
    };

    snapshot = {
      lastUpdated: '2018-04-11 09:00:00'
    };

    getArticles(options, snapshot)
      .then((res) => {
        console.log(res.length);
        return res;
      }).catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();

module.exports = {
  createSession,
  getArticles
};
