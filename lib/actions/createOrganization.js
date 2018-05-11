const request = require('request-promise');
const wice = require('./wice');
const config = require('./../../config/config');
const cfg = config.getEnvironment();

const input = {
  name: 'Cömpany Ltd 3'
};

wice.createSession(cfg, async () => {
  if (cfg.cookie) {

    const organization = JSON.stringify(input);
    let existingRowid = 0;

    const options = {
      method: 'POST',
      uri: `${cfg.path}/plugin/wp_elasticio_backend/json`,
      headers: {
        'X-API-KEY': cfg.apikey
      }
    };

    checkForExistingCompany()
      .then(() => {
        if (existingRowid == 0) {
          console.log('Creating an organization ...');
          createOrUpdateOrganization('insert_company', organization);
        } else {
          input.rowid = existingRowid;
          createOrUpdateOrganization('update_company', organization);
        }
      });

    function checkForExistingCompany() {
      options.form = {
        method: 'get_all_companies',
        cookie: cfg.cookie,
        ext_search_do: 1,
        name: input.name
      };

      return new Promise((resolve, reject) => {
        request.post(options)
          .then((res) => {
            const resObj = JSON.parse(res);
            if (resObj.loop_addresses) {
              existingRowid = resObj.loop_addresses[0].rowid;
              console.log(`Organization alredy exists ... ROWID: ${existingRowid}`);
            }
            resolve(existingRowid);
          })
          .catch((err) => {
            reject(err);
          });
      });
    };

    function createOrUpdateOrganization(method, organization) {
      options.form = {
        method,
        cookie: cfg.cookie,
        data: organization
      };
      request.post(options).then((res) => {
        reply = res;
        return reply;
      });
    }
  } else {
    console.log('ERROR: No cookie found...');
    return;
  }
});
