const request = require('request-promise');
const wice = require('./wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const input = {
  description: 'Arduino Nano SW 2.2',
  number: 8888
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    const article = JSON.stringify(input);
    let existingRowid = 0;
    let reply = {};

    const options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    checkForExistingArticle()
      .then(() => {
        if (existingRowid == 0) {
          console.log('Creating an article ...');
          createOrUpdateArticle('insert_article', article);
        } else {
          input.rowid = existingRowid;
          createOrUpdateArticle('update_article', article);
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
            const resObj = JSON.parse(res);
            if (resObj.loop_articles) {
              existingRowid = resObj.loop_articles[0].rowid;
              console.log(`Article already exists ... ROWID: ${existingRowid}`);
            }
            resolve(existingRowid);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    function createOrUpdateArticle(method, article) {
      options.form = {
        method,
        cookie: cfg.cookie,
        data: article
      };
      request.post(options)
        .then((res) => {
          reply = res;
          return reply;
        });
    };

  } else {
    console.log('ERROR: No cookie found...');
    return;
  }
});
