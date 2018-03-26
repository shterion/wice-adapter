const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  rowid: 5753
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    // const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=delete_article&cookie=${cfg.cookie}&data=${article}`;
    let options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      form: {
        method: 'delete_article',
        cookie: cfg.cookie,
        data: article
      },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    request.post(options).then((res) => {
      let deletedArticle = JSON.parse(res);
      console.log(JSON.stringify(deletedArticle, undefined, 2));
    }, (err) => {
      console.log(`ERROR: ${err}`);
    }).catch((e) => {
      console.log(`ERROR: ${e}`);
    });

    // try {
    //   let deletedArticle = await request.get(uri);
    //   // console.log(`DELETED ARTICLE: ${deletedArticle}`);
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
