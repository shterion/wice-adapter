"use strict";
const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

// Update an artile
let input = {
  rowid: 5745,
  description: 'Rechner'
};


wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_article&cookie=${cfg.cookie}&data=${article}`;

    let options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      form: {
        method: 'update_article',
        cookie: cfg.cookie,
        data: article
      },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.post(options).then((res) => {
      let updatedArticle = JSON.parse(res);
      // console.log(JSON.stringify(updatedArticle, undefined, 2));
    }, (err) => {
      console.log(`ERROR: ${err}`);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let updatedArticle= await request.get(uri);
    //   let response = JSON.parse(updatedArticle);
    //   console.log(JSON.stringify(response, undefined, 2));
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
