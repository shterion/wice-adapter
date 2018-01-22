const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    // let uri = `${cfg.path}/pserv/base/json?method=get_all_articles&cookie=${cfg.cookie}`;
    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_articles&cookie=${cfg.cookie}`;

    try {
      let articles = await request.get(uri);
      let resObj = JSON.parse(articles);
      console.log(`ARTICLES LENGTH:${resObj.loop_articles.length}`);
      // console.log(JSON.stringify(resObj.loop_articles, undefined, 2));
    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
