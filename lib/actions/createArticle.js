const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

let input = {
  // rowid: 5735,
  // number: 5735,
  description: 'Arduino Nano SW 2',
  number: 8888
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    let existingRowid = 0;

    let options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      form: {
        method: '',
        cookie: '',
        data: '',
      },
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    checkForExistingArticle().then(() => {
      if (existingRowid == 0) {
        console.log('Creating an article ...');
        requestToWice('insert_article', article);

      } else {
        input.rowid = existingRowid;
        requestToWice('update_article', article);
      }
    });

    function checkForExistingArticle() {

      options.form = {
        method: 'get_all_articles',
        cookie: cfg.cookie,
        search_filter: input.description
      };

      return new Promise((resolve, reject) => {
        request.post(options)
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

    function requestToWice(method, article) {

      options.form = {
        method,
        cookie: cfg.cookie,
        data: article
      };

      request.post(options).then((res) => {
        reply = res;
        // console.log(typeof res);
      });
    };

  } else {
    console.log('ERROR: No cookie found...');
  }
});
