const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 410865
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=delete_article&cookie=${cfg.cookie}&data=${article}`;

    try {
      let deletedArticle = await request.get(uri);
      console.log(`DELETED ARTICLE: ${deletedArticle}}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
