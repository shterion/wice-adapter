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
  rowid: 5711
};

async function getArticle(options) {
  try {
    const article = await request.get(options);
    const articleObj = JSON.parse(article);

    if (!articleObj.rowid) {
      throw new Error(`No article with ROWID: ${input.rowid} found...`)
    }

    return customArticle(articleObj);
  } catch (e) {
    throw new Error(e);
  }
}

function customArticle(article) {
  const customArticleFormat = {
    rowid: article.rowid,
    description: article.description,
    sales_price: article.sales_price,
    purchase_price: article.purchase_price,
    in_stock : article.in_stock,
    unit: article.unit,
    price_list_highlight: article.price_list_highlight
  };
  return  customArticleFormat;
}

(async function () {
  try {
    const cookie = await createSession(cfg);
    const options = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_article&cookie=${cookie}&show_detailview=${input.rowid}`,
      headers: { 'X-API-KEY': cfg.apikey }
    };

    getArticle(options)
      .then((res) => {
        console.log(res);
        return res;
      }).catch((e) => console.log(e));
  } catch (e) {
    throw new Error(e);
  }
})();
