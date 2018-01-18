const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 5715
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let getArticle = JSON.stringify(input);
    let uri = `${cfg.path}/pserv/base/json?method=get_article&cookie=${cfg.cookie}&data=${getArticle}`;

    try {
      let getArticle = await request.get(uri);
      console.log(JSON.parse(getArticle));
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
