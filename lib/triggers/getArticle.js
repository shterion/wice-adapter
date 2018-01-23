const request = require('request-promise');

const wice = require('./../actions/wice');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 5749
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_articles&cookie=${cfg.cookie}`;

    try {
      let articles = await request.get(uri);
      let resObj = JSON.parse(articles);
// console.log(resObj.loop_articles[0].rowid);

      for (const article of Object.keys(resObj.loop_articles)) {
        if (resObj.loop_articles[article].rowid == input.rowid) {
          console.log(resObj.loop_articles[article]);
          return resObj.loop_articles[article];
        }
      }

    // let getArticle = JSON.stringify(input);
    // let uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_article&cookie=${cfg.cookie}&data=${getArticle}`;
    //
    // try {
    //   let getArticle = await request.get(uri);
    //   console.log(JSON.parse(getArticle));

    } catch (e) {
      console.log(`ERROR: ${e}`);
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
