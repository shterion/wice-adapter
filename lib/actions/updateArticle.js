"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// Update an artile
let input = {
  rowid: 5750,
  description: 'Update Test'
};


wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_article&cookie=${cfg.cookie}&data=${article}`;

    try {
      let updatedArticle= await request.get(uri);
      // let updatedUser = JSON.parse(person);
      console.log(`UPDATED ARTICLE: ${updatedArticle}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
