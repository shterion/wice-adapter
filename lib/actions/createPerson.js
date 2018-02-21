const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Frenchy',
  firstname: 'Ben',
  same_contactperson: 'auto'
};

wice.createSession(cfg, () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
    let existingRowid = 0;
    let requestOptions = {
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json?method=get_all_persons&cookie=${cfg.cookie}&ext_search_do=1&name=${input.name}`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    checkForExistingUser().then(() => {
      if (existingRowid == 0) {
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=insert_contact&cookie=${cfg.cookie}&data=${user}`;
        requestToWice(uri);

      } else {
        input.rowid = existingRowid;
        const uri = `${cfg.path}/plugin/wp_elasticio_backend/json?method=update_contact&cookie=${cfg.cookie}&data=${user}`;
        requestToWice(uri);
      }
    });

    function checkForExistingUser() {
      return new Promise((resolve, reject) => {
        request.get(requestOptions).then((res) => {
          let resObj = JSON.parse(res);

          if (resObj.loop_addresses) {
            existingRowid = resObj.loop_addresses[0].rowid;
            console.log(`Person alredy exists ... ROWID: ${existingRowid}`);
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
      });
    }

  } else {
    console.log('ERROR: No cookie found...');
  }
});
