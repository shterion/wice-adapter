const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

let input = {
  description: 'Keyboard',
  number: 'auto'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    let existingRowid = 0;

    checkForExistingArticle().then(() => {
      if (existingRowid == 0) {
        console.log('Flag 1', existingRowid);
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_article&cookie=${cfg.cookie}&data=${article}`;
        requestToWice(uri);

      } else {
        console.log('Flag 2', existingRowid);
        input.rowid = existingRowid;
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_article&cookie=${cfg.cookie}&data=${article}`;
        requestToWice(uri);
      }
    });

    function checkForExistingArticle() {
      let options = {
        method: 'POST',
        uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
        form: {
          method: 'get_all_articles',
          cookie: cfg.cookie,
          search_filter: input.description
        },
        headers: {
          'X-API-KEY': cfg.apikey
        }
      };

      return new Promise((resolve, reject) => {
        request(options)
          .then((res) => {
            let resObj = JSON.parse(res);
            if (resObj.loop_articles) {
              existingRowid = resObj.loop_articles[0].rowid;
              console.log(`Article alredy exists ... ROWID: ${existingRowid}`);
            }
            resolve(true);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    function requestToWice(uri) {
      request.get(uri).then((res) => {
        reply = res;
        // console.log(typeof res);
      });
    };

  } else {
    console.log('ERROR: No cookie found...');
  }
});
