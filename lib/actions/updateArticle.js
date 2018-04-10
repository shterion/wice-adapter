"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// Update an article
let input = {
  rowid: 410854,
  name: 'Fox'
};


wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=update_article&cookie=${cfg.cookie}&data=${article}`;

    try {
      let updatedArticle = await request.get(uri);
      // let updatedArticle = JSON.parse(article);
      console.log(`UPDATED ARTICLE: ${updatedArticle}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
