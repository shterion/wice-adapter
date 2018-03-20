const request = require('request-promise');

const wice = require('./wice.js');
const config = require('./../../config/config');

const cfg = config.getEnvironment();

let input = {
  name: 'Pötärsü Jnr.',
  firstname: 'Söbastän',
  email: 'löw@mail.com',
  same_contactperson: 'auto'
  // rowid: 412149
};

wice.createSession(cfg, () => {
  if (cfg.cookie) {

    let user = JSON.stringify(input);
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

    checkForExistingUser().then(() => {
      if (existingRowid == 0) {
        console.log('Creating a person ...');
        requestToWice('insert_contact', user);

      } else {
        input.rowid = existingRowid;
        requestToWice('update_contact', user);
      }
    });

    function checkForExistingUser() {

      options.form = {
          method: 'get_all_persons',
          cookie: cfg.cookie,
          ext_search_do: 1,
          name: input.name
      };

      return new Promise((resolve, reject) => {
        request.post(options).then((res) => {
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

    function requestToWice(method, user) {

      options.form = {
        method,
        cookie: cfg.cookie,
        data: user
      };

      request.post(options).then((res) => {
        reply = res;
      });
    };

  } else {
    console.log('ERROR: No cookie found...');
  }
});
