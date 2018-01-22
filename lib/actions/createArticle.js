const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  description: 'Tool1',
  number: 'auto'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_article&cookie=${cfg.cookie}&data=${article}`;

    request.get(uri, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        let data = JSON.parse(body);
        console.log(`Article:${data['rowid']}`);
      }
    });

    // try {
    //   let newArticle = await request.get(uri);
    //   console.log(`NEW ARTICLE ADDED: ${newArticle}`);
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
