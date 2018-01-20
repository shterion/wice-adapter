const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Tool'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=insert_article&cookie=${cfg.cookie}&data=${article}`;

    try {
      let newArticle = await request.get(uri);
      console.log(`NEW ARTICLE ADDED: ${newArticle}`);
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
