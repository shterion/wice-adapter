const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let reply = {};

let input = {
  description: 'Tool',
  number: 'auto'
}

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    let article = JSON.stringify(input);
    let existingRowid = 0;
    let requestOptions = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_articles&cookie=${cfg.cookie}&ext_search_do=1&name=${input.description}`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

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
      return new Promise((resolve, reject) => {
        request.get(requestOptions).then((res) => {
          let resObj = JSON.parse(res);
          console.log(resObj.loop_addresses);
          if (resObj.loop_addresses) {
            existingRowid = resObj.loop_addresses[0].rowid;
            console.log(`Article alredy exists ... ROWID: ${existingRowid}`);
          }
          resolve(true);
        }).catch((e) => {
          reject(e);
        })
      });
    };

    function requestToWice(uri) {
      request.get(uri).then((res) => {
        reply = res;
        // console.log(typeof res);
      });
    };

    // START
    // let article = JSON.stringify(input);
    // const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_article&cookie=${cfg.cookie}&data=${article}`;
    //
    // request.get(uri).then((res) => {
    //   reply = JSON.parse(res);
    //   console.log(`Article:${reply['rowid']}`);
    // }, (err) => {
    //   console.log(`ERROR: ${err}`);
    // }).catch((e) => {
    //   console.log(`ERROR: ${e}`);
    // });
    // END OF WORKING PART

    // request.get(uri, (error, response, body) => {
    //   if (!error && response.statusCode == 200) {
    //     let data = JSON.parse(body);
    //     console.log(`Article:${data['rowid']}`);
    //   }
    // });

    // try {
    //   let newArticle = await request.get(uri);
    //   console.log(`NEW ARTICLE ADDED: ${newArticle['description']}`);
    // } catch (e) {
    //   console.log(`ERROR: ${e}`);
    // }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
