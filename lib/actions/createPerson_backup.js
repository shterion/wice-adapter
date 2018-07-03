const request = require('request-promise');
const wice = require('./wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const input = [{
  name: 'Peters',
  firstname: 'Seb',
  email: 'speters@mail.com',
  same_contactperson: 'auto'
}];

wice.createSession(cfg, () => {
  if (cfg.cookie) {
    let existingRowid = 0;

    const options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    for (var person of input) {
      const user = JSON.stringify(person);
      checkForExistingUser()
      .then(() => {
        if (existingRowid == 0) {
          console.log('Creating a person ...');
          createOrUpdatePerson('insert_contact', user);
        } else {
          input.rowid = existingRowid;
          createOrUpdatePerson('update_contact', user);
        }
      });
    }

    function checkForExistingUser() {
      options.form = {
        method: 'get_all_persons',
        cookie: cfg.cookie,
        ext_search_do: 1,
        name: person.name
      };

      return new Promise((resolve, reject) => {
        request.post(options).then((res) => {
          const resObj = JSON.parse(res);
          if (resObj.loop_addresses) {
            existingRowid = resObj.loop_addresses[0].rowid;
            console.log(`Person already exists ... ROWID: ${existingRowid}`);
          }
          resolve(existingRowid);
        }).catch((e) => {
          reject(e);
        })
      });
    };

    function createOrUpdatePerson(method, user) {
      options.form = {
        method,
        cookie: cfg.cookie,
        data: user
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
